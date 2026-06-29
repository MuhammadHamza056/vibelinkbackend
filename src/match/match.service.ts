import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { ChallengesService } from '../challenges/challenges.service';
import { NearbyQueryDto } from './dto/nearby-query.dto';
import {
  Connection,
  ConnectionDocument,
} from './schemas/connection.schema';
import {
  ConnectionStatus,
  MATCH_RADIUS_METERS,
  MIN_VIBE_MATCH_SCORE,
} from '../common/constants/app.constants';

// Shape returned for any user embedded in a match/connection response.
type UserSummary = Pick<User, 'username' | 'avatarUrl' | 'level' | 'vibeTags'> & {
  id: string;
};

@Injectable()
export class MatchService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Connection.name)
    private readonly connectionModel: Model<ConnectionDocument>,
    private readonly usersService: UsersService,
    private readonly challengesService: ChallengesService,
  ) {}

  // Jaccard similarity between two vibe-tag sets (0..1).
  private vibeScore(a: string[], b: string[]): number {
    if (!a.length || !b.length) return 0;
    const setB = new Set(b);
    const intersection = a.filter((t) => setB.has(t)).length;
    const union = new Set([...a, ...b]).size;
    return union === 0 ? 0 : intersection / union;
  }

  private summarize(u: UserDocument): UserSummary {
    return {
      id: u.id,
      username: u.username,
      avatarUrl: u.avatarUrl,
      level: u.level,
      vibeTags: u.vibeTags,
    };
  }

  async nearby(userId: string, query: NearbyQueryDto) {
    const me = await this.usersService.findById(userId);
    if (!me.location?.coordinates?.length) {
      throw new BadRequestException(
        'Set your location first via PUT /api/profile/location',
      );
    }

    const radius = query.radius ?? MATCH_RADIUS_METERS;
    const limit = query.limit ?? 20;

    const candidates = await this.userModel
      .find({
        _id: { $ne: new Types.ObjectId(userId) },
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: me.location.coordinates,
            },
            $maxDistance: radius,
          },
        },
      })
      .limit(limit * 2)
      .exec();

    // Connection state with each candidate, so the frontend knows whether to
    // show "Connect", "Requested", "Respond", or "Connected".
    const statusByUser = await this.connectionStatuses(
      userId,
      candidates.map((u) => u.id),
    );

    const matches = candidates
      .map((u) => {
        const score = this.vibeScore(me.vibeTags, u.vibeTags);
        return {
          user: this.summarize(u),
          vibeScore: Number(score.toFixed(2)),
          sharedTags: me.vibeTags.filter((t) => u.vibeTags.includes(t)),
          connection:
            statusByUser[u.id] ?? {
              status: 'none',
              direction: null,
              sharedChallengeId: null,
            },
        };
      })
      .filter((m) => m.vibeScore >= MIN_VIBE_MATCH_SCORE)
      .sort((a, b) => b.vibeScore - a.vibeScore)
      .slice(0, limit);

    return {
      radius,
      minScore: MIN_VIBE_MATCH_SCORE,
      count: matches.length,
      matches,
    };
  }

  // Returns the connection state keyed by the *other* user's id. `direction`
  // is 'outgoing' when I am the requester, 'incoming' when I am the recipient.
  private async connectionStatuses(
    userId: string,
    otherIds: string[],
  ): Promise<
    Record<
      string,
      {
        status: ConnectionStatus;
        direction: 'outgoing' | 'incoming';
        sharedChallengeId: string | null;
      }
    >
  > {
    const me = new Types.ObjectId(userId);
    const others = otherIds.map((id) => new Types.ObjectId(id));
    const rows = await this.connectionModel
      .find({
        $or: [
          { requester: me, recipient: { $in: others } },
          { recipient: me, requester: { $in: others } },
        ],
      })
      .exec();

    const map: Record<
      string,
      {
        status: ConnectionStatus;
        direction: 'outgoing' | 'incoming';
        sharedChallengeId: string | null;
      }
    > = {};
    for (const row of rows) {
      const iAmRequester = row.requester.toString() === userId;
      const otherId = iAmRequester
        ? row.recipient.toString()
        : row.requester.toString();
      map[otherId] = {
        status: row.status,
        direction: iAmRequester ? 'outgoing' : 'incoming',
        sharedChallengeId: row.sharedChallengeId ?? null,
      };
    }
    return map;
  }

  // Send a connection request. If the target already has a pending request out
  // to me, this accepts it instead (mutual intent → instant connection).
  async connect(userId: string, targetId: string) {
    if (userId === targetId) {
      throw new BadRequestException('You cannot connect with yourself');
    }
    const target = await this.usersService.findById(targetId);

    const me = new Types.ObjectId(userId);
    const them = new Types.ObjectId(targetId);

    // Did they already request me? Then accept it for a mutual match.
    const reverse = await this.connectionModel
      .findOne({ requester: them, recipient: me })
      .exec();
    if (reverse && reverse.status === ConnectionStatus.pending) {
      return this.finalizeAccept(reverse, userId);
    }
    if (reverse && reverse.status === ConnectionStatus.accepted) {
      throw new BadRequestException('You are already connected');
    }

    // My own existing request to them.
    const existing = await this.connectionModel
      .findOne({ requester: me, recipient: them })
      .exec();
    if (existing) {
      if (existing.status === ConnectionStatus.accepted) {
        throw new BadRequestException('You are already connected');
      }
      if (existing.status === ConnectionStatus.pending) {
        throw new BadRequestException('Request already sent');
      }
      // Previously rejected — allow re-requesting.
      existing.status = ConnectionStatus.pending;
      await existing.save();
      return {
        status: existing.status,
        connectionId: existing.id,
        user: this.summarize(target),
      };
    }

    const created = await this.connectionModel.create({
      requester: me,
      recipient: them,
      status: ConnectionStatus.pending,
    });
    return {
      status: created.status,
      connectionId: created.id,
      user: this.summarize(target),
    };
  }

  // Marks a pending connection accepted, bumps matchesCount for both users, and
  // assigns a shared challenge for them to complete together. `acceptingUserId`
  // is the caller, so the response can name the *other* user as the partner.
  private async finalizeAccept(
    connection: ConnectionDocument,
    acceptingUserId: string,
  ) {
    connection.status = ConnectionStatus.accepted;

    const requesterId = connection.requester.toString();
    const recipientId = connection.recipient.toString();
    const [requester, recipient] = await Promise.all([
      this.usersService.findById(requesterId),
      this.usersService.findById(recipientId),
    ]);

    // Pick (once) a challenge fitting both users' vibes for them to do together.
    const sharedChallenge = await this.challengesService.pickForVibes(
      requester.vibeTags,
      recipient.vibeTags,
    );
    connection.sharedChallengeId = sharedChallenge?.id ?? null;
    await connection.save();

    await Promise.all([
      this.usersService.incrementCounters(requesterId, { matchesCount: 1 }),
      this.usersService.incrementCounters(recipientId, { matchesCount: 1 }),
    ]);

    const partner = acceptingUserId === requesterId ? recipient : requester;
    return {
      status: connection.status,
      connectionId: connection.id,
      partner: this.summarize(partner),
      sharedChallenge: sharedChallenge ? sharedChallenge.toJSON() : null,
    };
  }

  async accept(userId: string, connectionId: string) {
    const connection = await this.findRequestForRecipient(userId, connectionId);
    return this.finalizeAccept(connection, userId);
  }

  async reject(userId: string, connectionId: string) {
    const connection = await this.findRequestForRecipient(userId, connectionId);
    connection.status = ConnectionStatus.rejected;
    await connection.save();
    return { status: connection.status, connectionId: connection.id };
  }

  // Loads a pending connection and asserts the caller is its recipient.
  private async findRequestForRecipient(
    userId: string,
    connectionId: string,
  ): Promise<ConnectionDocument> {
    if (!Types.ObjectId.isValid(connectionId)) {
      throw new NotFoundException('Connection not found');
    }
    const connection = await this.connectionModel.findById(connectionId).exec();
    if (!connection) throw new NotFoundException('Connection not found');
    if (connection.recipient.toString() !== userId) {
      throw new ForbiddenException('This request is not addressed to you');
    }
    if (connection.status !== ConnectionStatus.pending) {
      throw new BadRequestException(
        `Request is already ${connection.status}`,
      );
    }
    return connection;
  }

  // All connection requests addressed to me, any status, newest first.
  // Used by the notifications module to render the request feed.
  async incomingConnections(userId: string) {
    const rows = await this.connectionModel
      .find({ recipient: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .populate<{ requester: UserDocument }>('requester')
      .exec();

    return rows.map((row) => ({
      connectionId: row.id,
      status: row.status,
      user: this.summarize(row.requester),
      createdAt: (row as unknown as { createdAt: Date }).createdAt,
    }));
  }

  // Accepted connections where I am either party, newest first. The `user` is
  // always the *other* person, plus the challenge we share (if any).
  async listConnections(userId: string) {
    const me = new Types.ObjectId(userId);
    const rows = await this.connectionModel
      .find({
        status: ConnectionStatus.accepted,
        $or: [{ requester: me }, { recipient: me }],
      })
      .sort({ updatedAt: -1 })
      .populate<{ requester: UserDocument; recipient: UserDocument }>(
        'requester recipient',
      )
      .exec();

    const connections = rows.map((row) => {
      const other =
        row.requester.id === userId ? row.recipient : row.requester;
      return {
        connectionId: row.id,
        user: this.summarize(other),
        sharedChallengeId: row.sharedChallengeId ?? null,
      };
    });
    return { count: connections.length, connections };
  }

  // Leave an accepted connection. Either party may do this; the record is
  // removed and both users' matchesCount is decremented so a fresh request can
  // be sent later.
  async leave(userId: string, connectionId: string) {
    if (!Types.ObjectId.isValid(connectionId)) {
      throw new NotFoundException('Connection not found');
    }
    const connection = await this.connectionModel
      .findById(connectionId)
      .exec();
    if (!connection) throw new NotFoundException('Connection not found');

    const requesterId = connection.requester.toString();
    const recipientId = connection.recipient.toString();
    if (userId !== requesterId && userId !== recipientId) {
      throw new ForbiddenException('This connection is not yours');
    }
    if (connection.status !== ConnectionStatus.accepted) {
      throw new BadRequestException('This connection is not active');
    }

    await connection.deleteOne();
    await Promise.all([
      this.usersService.incrementCounters(requesterId, { matchesCount: -1 }),
      this.usersService.incrementCounters(recipientId, { matchesCount: -1 }),
    ]);

    return { left: true, connectionId };
  }
}

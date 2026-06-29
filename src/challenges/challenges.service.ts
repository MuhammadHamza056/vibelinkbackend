import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Challenge, ChallengeDocument } from './schemas/challenge.schema';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { QueryChallengesDto } from './dto/query-challenges.dto';
import { UsersService } from '../users/users.service';
import { UserDocument } from '../users/schemas/user.schema';
import {
  Connection,
  ConnectionDocument,
} from '../match/schemas/connection.schema';
import { ConnectionStatus } from '../common/constants/app.constants';
import { levelFromXp } from '../common/leveling';

// A connected user you've been paired with on a shared challenge.
export interface SharedPartner {
  connectionId: string;
  user: {
    id: string;
    username: string;
    avatarUrl: string;
    level: number;
  };
}

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel(Challenge.name)
    private readonly challengeModel: Model<ChallengeDocument>,
    @InjectModel(Connection.name)
    private readonly connectionModel: Model<ConnectionDocument>,
    private readonly usersService: UsersService,
  ) {}

  async create(dto: CreateChallengeDto) {
    const challenge = await this.challengeModel.create(dto);
    return challenge.toJSON();
  }

  async findAll(userId: string, query: QueryChallengesDto) {
    const filter: Record<string, unknown> = { isActive: true };
    if (query.category) filter.category = query.category;
    if (query.difficulty) filter.difficulty = query.difficulty;
    const challenges = await this.challengeModel
      .find(filter)
      .sort({ createdAt: -1 })
      .exec();

    const partners = await this.sharedPartnersFor(
      userId,
      challenges.map((c) => c.id),
    );
    return challenges.map((c) => this.withSharedPartners(c, partners));
  }

  async findById(id: string): Promise<ChallengeDocument> {
    const challenge = await this.challengeModel.findById(id).exec();
    if (!challenge) throw new NotFoundException('Challenge not found');
    return challenge;
  }

  // Single challenge annotated with the partner(s) you share it with.
  async findOneForUser(userId: string, id: string) {
    const challenge = await this.findById(id);
    const partners = await this.sharedPartnersFor(userId, [challenge.id]);
    return this.withSharedPartners(challenge, partners);
  }

  // Maps challengeId -> partners the user is doing that challenge together with.
  // A challenge is "shared" when an accepted connection of the user has it set
  // as its sharedChallengeId.
  private async sharedPartnersFor(
    userId: string,
    challengeIds: string[],
  ): Promise<Record<string, SharedPartner[]>> {
    const map: Record<string, SharedPartner[]> = {};
    if (!challengeIds.length) return map;

    const me = new Types.ObjectId(userId);
    const rows = await this.connectionModel
      .find({
        status: ConnectionStatus.accepted,
        sharedChallengeId: { $in: challengeIds },
        $or: [{ requester: me }, { recipient: me }],
      })
      .populate<{ requester: UserDocument; recipient: UserDocument }>(
        'requester recipient',
      )
      .exec();

    for (const row of rows) {
      if (!row.sharedChallengeId) continue;
      const other =
        row.requester.id === userId ? row.recipient : row.requester;
      const partner: SharedPartner = {
        connectionId: row.id,
        user: {
          id: other.id,
          username: other.username,
          avatarUrl: other.avatarUrl,
          level: other.level,
        },
      };
      (map[row.sharedChallengeId] ??= []).push(partner);
    }
    return map;
  }

  // Attaches a `sharedWith` array (empty when not shared) to a challenge's JSON.
  private withSharedPartners(
    challenge: ChallengeDocument,
    partners: Record<string, SharedPartner[]>,
  ): Record<string, any> {
    const sharedWith = partners[challenge.id] ?? [];
    const json = challenge.toJSON() as Record<string, any>;
    return { ...json, isShared: sharedWith.length > 0, sharedWith };
  }

  // Picks the active challenge that best fits two users' combined vibe tags,
  // used to suggest something for newly-connected users to do together.
  // Falls back to any active challenge when there is no tag overlap.
  async pickForVibes(
    tagsA: string[],
    tagsB: string[],
  ): Promise<ChallengeDocument | null> {
    const active = await this.challengeModel.find({ isActive: true }).exec();
    if (!active.length) return null;

    const wanted = new Set([...tagsA, ...tagsB]);
    if (!wanted.size) return active[0];

    return active
      .map((c) => ({
        challenge: c,
        overlap: c.vibeTags.filter((t) => wanted.has(t)).length,
      }))
      .sort((a, b) => b.overlap - a.overlap)[0].challenge;
  }

  // Marks a challenge active for the user (tracked on the user doc).
  async start(userId: string, challengeId: string) {
    const challenge = await this.findById(challengeId);
    const user = await this.usersService.findById(userId);
    if (user.activeChallengeIds.includes(challenge.id)) {
      throw new BadRequestException('Challenge already in progress');
    }
    user.activeChallengeIds.push(challenge.id);
    await user.save();
    return { challenge: challenge.toJSON(), activeChallengeIds: user.activeChallengeIds };
  }

  // Completes an active challenge, awards XP, and bumps the completion counter.
  async complete(userId: string, challengeId: string) {
    const challenge = await this.findById(challengeId);
    const user = await this.usersService.findById(userId);
    if (!user.activeChallengeIds.includes(challenge.id)) {
      throw new BadRequestException('Challenge is not active for this user');
    }

    user.activeChallengeIds = user.activeChallengeIds.filter(
      (id) => id !== challenge.id,
    );
    user.xp += challenge.xpReward;
    user.level = levelFromXp(user.xp);
    user.challengesCompleted += 1;
    user.lastActiveDate = new Date();
    await user.save();

    return {
      challenge: challenge.toJSON(),
      xpAwarded: challenge.xpReward,
      user: user.toJSON(),
    };
  }
}

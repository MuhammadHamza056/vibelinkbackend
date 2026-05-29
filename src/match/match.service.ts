import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { NearbyQueryDto } from './dto/nearby-query.dto';
import {
  MATCH_RADIUS_METERS,
  MIN_VIBE_MATCH_SCORE,
} from '../common/constants/app.constants';

@Injectable()
export class MatchService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly usersService: UsersService,
  ) {}

  // Jaccard similarity between two vibe-tag sets (0..1).
  private vibeScore(a: string[], b: string[]): number {
    if (!a.length || !b.length) return 0;
    const setB = new Set(b);
    const intersection = a.filter((t) => setB.has(t)).length;
    const union = new Set([...a, ...b]).size;
    return union === 0 ? 0 : intersection / union;
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

    const matches = candidates
      .map((u) => {
        const score = this.vibeScore(me.vibeTags, u.vibeTags);
        return {
          user: {
            id: u.id,
            username: u.username,
            avatarUrl: u.avatarUrl,
            level: u.level,
            vibeTags: u.vibeTags,
          },
          vibeScore: Number(score.toFixed(2)),
          sharedTags: me.vibeTags.filter((t) => u.vibeTags.includes(t)),
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
}

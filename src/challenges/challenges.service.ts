import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Challenge, ChallengeDocument } from './schemas/challenge.schema';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { QueryChallengesDto } from './dto/query-challenges.dto';
import { UsersService } from '../users/users.service';
import { levelFromXp } from '../common/leveling';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel(Challenge.name)
    private readonly challengeModel: Model<ChallengeDocument>,
    private readonly usersService: UsersService,
  ) {}

  async create(dto: CreateChallengeDto) {
    const challenge = await this.challengeModel.create(dto);
    return challenge.toJSON();
  }

  async findAll(query: QueryChallengesDto) {
    const filter: Record<string, unknown> = { isActive: true };
    if (query.category) filter.category = query.category;
    if (query.difficulty) filter.difficulty = query.difficulty;
    const challenges = await this.challengeModel
      .find(filter)
      .sort({ createdAt: -1 })
      .exec();
    return challenges.map((c) => c.toJSON());
  }

  async findById(id: string): Promise<ChallengeDocument> {
    const challenge = await this.challengeModel.findById(id).exec();
    if (!challenge) throw new NotFoundException('Challenge not found');
    return challenge;
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

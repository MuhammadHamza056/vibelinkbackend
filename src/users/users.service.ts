import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { AuthProvider } from '../common/constants/app.constants';
import { levelFromXp } from '../common/leveling';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(
    email: string,
    withPassword = false,
  ): Promise<UserDocument | null> {
    const query = this.userModel.findOne({ email: email.toLowerCase() });
    if (withPassword) query.select('+passwordHash');
    return query.exec();
  }

  async create(data: {
    email: string;
    username: string;
    passwordHash?: string;
    provider?: AuthProvider;
  }): Promise<UserDocument> {
    return this.userModel.create({
      email: data.email.toLowerCase(),
      username: data.username,
      passwordHash: data.passwordHash,
      provider: data.provider ?? AuthProvider.email,
    });
  }

  // Awards XP and recomputes the derived level. Returns the updated user.
  async addXp(id: string, amount: number): Promise<UserDocument> {
    const user = await this.findById(id);
    user.xp += amount;
    user.level = levelFromXp(user.xp);
    user.lastActiveDate = new Date();
    await user.save();
    return user;
  }

  async startChallenge(userId: string, challengeId: string): Promise<UserDocument> {
    const user = await this.userModel
      .findOneAndUpdate(
        { _id: userId, activeChallengeIds: { $ne: challengeId } },
        { $push: { activeChallengeIds: challengeId } },
        { new: true },
      )
      .exec();

    if (!user) {
      const existing = await this.findById(userId);
      if (existing.activeChallengeIds.includes(challengeId)) {
        throw new BadRequestException('Challenge already in progress');
      }
      return existing;
    }
    return user;
  }

  async completeChallenge(
    userId: string,
    challengeId: string,
    xpReward: number,
  ): Promise<UserDocument> {
    const user = await this.findById(userId);
    if (!user.activeChallengeIds.includes(challengeId)) {
      throw new BadRequestException('Challenge is not active for this user');
    }

    const updatedXp = user.xp + xpReward;
    const updatedLevel = levelFromXp(updatedXp);

    const updatedUser = await this.userModel
      .findOneAndUpdate(
        { _id: userId, activeChallengeIds: challengeId },
        {
          $pull: { activeChallengeIds: challengeId },
          $addToSet: { completedChallengeIds: challengeId },
          $inc: { xp: xpReward, challengesCompleted: 1 },
          $set: { level: updatedLevel, lastActiveDate: new Date() },
        },
        { new: true },
      )
      .exec();

    if (!updatedUser) {
      throw new BadRequestException('Challenge is not active for this user');
    }

    return updatedUser;
  }

  async incrementCounters(
    id: string,
    counters: Partial<
      Pick<User, 'challengesCompleted' | 'matchesCount' | 'memoriesCount'>
    >,
  ): Promise<void> {
    await this.userModel.updateOne({ _id: id }, { $inc: counters }).exec();
  }
}


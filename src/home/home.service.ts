import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ChallengesService } from '../challenges/challenges.service';
import { MemoriesService } from '../memories/memories.service';
import {
  BURNOUT_THRESHOLD_DAYS,
  ChallengeCategory,
} from '../common/constants/app.constants';
import {
  levelFromXp,
  levelProgress,
  levelTitle,
  xpToNextLevel,
} from '../common/leveling';

@Injectable()
export class HomeService {
  constructor(
    private readonly usersService: UsersService,
    private readonly challengesService: ChallengesService,
    private readonly memoriesService: MemoriesService,
  ) {}

  async dashboard(userId: string) {
    const user = await this.usersService.findById(userId);
    const level = levelFromXp(user.xp);

    const [available, recentMemories] = await Promise.all([
      this.challengesService.findAll(userId, {}),
      this.memoriesService.findMine(userId),
    ]);

    // Suggest challenges matching the user's vibe tags, falling back to any.
    const tagSet = new Set(user.vibeTags);
    const suggested = available
      .filter((c) => !user.activeChallengeIds.includes(c.id))
      .sort((a, b) => {
        const aMatch = a.vibeTags.filter((t: string) => tagSet.has(t)).length;
        const bMatch = b.vibeTags.filter((t: string) => tagSet.has(t)).length;
        return bMatch - aMatch;
      })
      .slice(0, 5);

    const daysSinceActive = Math.floor(
      (Date.now() - new Date(user.lastActiveDate).getTime()) / 86_400_000,
    );

    return {
      user: {
        id: user.id,
        username: user.username,
        avatarUrl: user.avatarUrl,
        xp: user.xp,
        streakDays: user.streakDays,
      },
      leveling: {
        level,
        title: levelTitle(level),
        xpToNextLevel: xpToNextLevel(user.xp),
        progress: levelProgress(user.xp),
      },
      stats: {
        challengesCompleted: user.challengesCompleted,
        matchesCount: user.matchesCount,
        memoriesCount: user.memoriesCount,
        badges: user.badges.length,
      },
      activeChallengeIds: user.activeChallengeIds,
      suggestedChallenges: suggested,
      recentMemories: recentMemories.slice(0, 3),
      categories: Object.values(ChallengeCategory),
      burnoutGuard: {
        enabled: user.isOnBurnoutGuard,
        daysSinceActive,
        nudge:
          daysSinceActive >= BURNOUT_THRESHOLD_DAYS
            ? 'You’ve been away a while — ease back in with a quick challenge.'
            : null,
      },
    };
  }
}

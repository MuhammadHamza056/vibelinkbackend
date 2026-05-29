import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UsersService } from './users.service';
import {
  levelFromXp,
  levelProgress,
  levelTitle,
  xpToNextLevel,
} from '../common/leveling';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get the authenticated user with leveling stats' })
  async me(@CurrentUser('userId') userId: string) {
    const user = await this.usersService.findById(userId);
    const level = levelFromXp(user.xp);
    return {
      ...user.toJSON(),
      leveling: {
        level,
        title: levelTitle(level),
        xpToNextLevel: xpToNextLevel(user.xp),
        progress: levelProgress(user.xp),
      },
    };
  }
}

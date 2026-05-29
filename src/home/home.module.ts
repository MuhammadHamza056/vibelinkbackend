import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { ChallengesModule } from '../challenges/challenges.module';
import { MemoriesModule } from '../memories/memories.module';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';

@Module({
  imports: [UsersModule, ChallengesModule, MemoriesModule],
  controllers: [HomeController],
  providers: [HomeService],
})
export class HomeModule {}

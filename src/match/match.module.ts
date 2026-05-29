import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';

@Module({
  // UsersModule re-exports MongooseModule with the User model.
  imports: [UsersModule],
  controllers: [MatchController],
  providers: [MatchService],
})
export class MatchModule {}

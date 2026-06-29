import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';
import { ChallengesModule } from '../challenges/challenges.module';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { Connection, ConnectionSchema } from './schemas/connection.schema';

@Module({
  // UsersModule re-exports MongooseModule with the User model.
  // ChallengesModule exports ChallengesService for picking a shared challenge.
  imports: [
    UsersModule,
    ChallengesModule,
    MongooseModule.forFeature([
      { name: Connection.name, schema: ConnectionSchema },
    ]),
  ],
  controllers: [MatchController],
  providers: [MatchService],
  exports: [MatchService],
})
export class MatchModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Challenge, ChallengeSchema } from './schemas/challenge.schema';
import { ChallengesService } from './challenges.service';
import { ChallengesController } from './challenges.controller';
import { UsersModule } from '../users/users.module';
import {
  Connection,
  ConnectionSchema,
} from '../match/schemas/connection.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Challenge.name, schema: ChallengeSchema },
      // Read-only access to connections so challenges can show shared partners.
      { name: Connection.name, schema: ConnectionSchema },
    ]),
    UsersModule,
  ],
  controllers: [ChallengesController],
  providers: [ChallengesService],
  exports: [ChallengesService, MongooseModule],
})
export class ChallengesModule {}

import { Module } from '@nestjs/common';
import { MatchModule } from '../match/match.module';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';

@Module({
  // MatchModule exports MatchService, which owns the connection data.
  imports: [MatchModule],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule {}

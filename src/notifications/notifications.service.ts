import { Injectable } from '@nestjs/common';
import { MatchService } from '../match/match.service';
import { ConnectionStatus } from '../common/constants/app.constants';

@Injectable()
export class NotificationsService {
  constructor(private readonly matchService: MatchService) {}

  // Builds the notification feed from incoming connection requests. Pending
  // ones are actionable (accept/reject); accepted/rejected are shown as history.
  async findMine(userId: string) {
    const items = await this.matchService.incomingConnections(userId);

    const notifications = items.map((item) => ({
      id: item.connectionId,
      type: 'connection_request' as const,
      status: item.status,
      title: this.titleFor(item.status, item.user.username),
      message: this.messageFor(item.status, item.user.username),
      actionable: item.status === ConnectionStatus.pending,
      user: item.user,
      createdAt: item.createdAt,
    }));

    const pendingCount = notifications.filter(
      (n) => n.status === ConnectionStatus.pending,
    ).length;

    return { count: notifications.length, pendingCount, notifications };
  }

  // Accept a pending connection from its notification.
  accept(userId: string, connectionId: string) {
    return this.matchService.accept(userId, connectionId);
  }

  // Reject a pending connection from its notification.
  reject(userId: string, connectionId: string) {
    return this.matchService.reject(userId, connectionId);
  }

  private titleFor(status: ConnectionStatus, username: string): string {
    switch (status) {
      case ConnectionStatus.pending:
        return 'New connection request';
      case ConnectionStatus.accepted:
        return `You connected with ${username}`;
      case ConnectionStatus.rejected:
        return 'Request declined';
    }
  }

  private messageFor(status: ConnectionStatus, username: string): string {
    switch (status) {
      case ConnectionStatus.pending:
        return `${username} wants to connect with you`;
      case ConnectionStatus.accepted:
        return `You and ${username} are now connected`;
      case ConnectionStatus.rejected:
        return `You declined ${username}’s request`;
    }
  }
}

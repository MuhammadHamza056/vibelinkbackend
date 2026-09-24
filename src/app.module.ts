import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import configuration from './config/configuration';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProfileModule } from './profile/profile.module';
import { ChallengesModule } from './challenges/challenges.module';
import { MemoriesModule } from './memories/memories.module';
import { MatchModule } from './match/match.module';
import { HomeModule } from './home/home.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ReviewsModule } from './reviews/reviews.module';
import { PrivacyModule } from './privacy/privacy.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    // Global rate limit: 120 requests per 60s window for standard API usage.
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }]),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('mongodbUri'),
      }),
    }),
    AuthModule,
    UsersModule,
    ProfileModule,
    ChallengesModule,
    MemoriesModule,
    MatchModule,
    HomeModule,
    NotificationsModule,
    ReviewsModule,
    PrivacyModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}

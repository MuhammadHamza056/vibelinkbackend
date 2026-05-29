import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from './config/configuration';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProfileModule } from './profile/profile.module';
import { ChallengesModule } from './challenges/challenges.module';
import { MemoriesModule } from './memories/memories.module';
import { MatchModule } from './match/match.module';
import { HomeModule } from './home/home.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
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
  ],
})
export class AppModule {}

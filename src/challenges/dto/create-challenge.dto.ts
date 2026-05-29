import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import {
  CHALLENGE_MAX_MINUTES,
  CHALLENGE_MIN_MINUTES,
  ChallengeCategory,
  ChallengeDifficulty,
} from '../../common/constants/app.constants';

export class CreateChallengeDto {
  @ApiProperty({ example: 'Compliment a stranger' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Brighten someone’s day with a genuine compliment.' })
  @IsString()
  description: string;

  @ApiPropertyOptional({ example: '💬' })
  @IsOptional()
  @IsString()
  emoji?: string;

  @ApiProperty({ enum: ChallengeCategory, example: ChallengeCategory.social })
  @IsEnum(ChallengeCategory)
  category: ChallengeCategory;

  @ApiPropertyOptional({
    enum: ChallengeDifficulty,
    example: ChallengeDifficulty.easy,
  })
  @IsOptional()
  @IsEnum(ChallengeDifficulty)
  difficulty?: ChallengeDifficulty;

  @ApiPropertyOptional({ example: 100 })
  @IsOptional()
  @IsInt()
  @Min(10)
  @Max(1000)
  xpReward?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsInt()
  @Min(CHALLENGE_MIN_MINUTES)
  @Max(CHALLENGE_MAX_MINUTES)
  durationMinutes?: number;

  @ApiPropertyOptional({ example: ['Creative', 'Chill'], isArray: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  vibeTags?: string[];
}

import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { VIBE_TAGS } from '../../common/constants/app.constants';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'jordan_v', minLength: 2, maxLength: 30 })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  username?: string;

  @ApiPropertyOptional({ example: 'https://cdn.vibelink.app/a/jordan.png' })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiPropertyOptional({
    description: 'Subset of the canonical vibe tags',
    example: ['Creative', 'Foodie', 'Chill'],
    isArray: true,
    enum: VIBE_TAGS,
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(VIBE_TAGS.length)
  @IsIn(VIBE_TAGS as unknown as string[], { each: true })
  vibeTags?: string[];

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  safetyPulseEnabled?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isOnBurnoutGuard?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  hasSeenOnboarding?: boolean;
}

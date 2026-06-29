import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
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

// Multipart form fields arrive as strings; these helpers coerce them back into
// the types the validators expect, while leaving real JSON values untouched.
const toBoolean = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value === 'true' : value;
const toArray = ({ value }: { value: unknown }) =>
  value === undefined || Array.isArray(value) ? value : [value];

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'jordan_v', minLength: 2, maxLength: 30 })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  username?: string;

  // Usually set by uploading an `avatar` file (multipart); may also be an
  // external URL string. An uploaded file overrides this value.
  @ApiPropertyOptional({ example: 'https://cdn.vibelink.app/a/jordan.png' })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Avatar image file (camera/gallery pick). Field name: avatar',
  })
  avatar?: any;

  @ApiPropertyOptional({
    description: 'Subset of the canonical vibe tags',
    example: ['Creative', 'Foodie', 'Chill'],
    isArray: true,
    enum: VIBE_TAGS,
  })
  @IsOptional()
  @Transform(toArray)
  @IsArray()
  @ArrayMaxSize(VIBE_TAGS.length)
  @IsIn(VIBE_TAGS as unknown as string[], { each: true })
  vibeTags?: string[];

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  safetyPulseEnabled?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  isOnBurnoutGuard?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  hasSeenOnboarding?: boolean;
}

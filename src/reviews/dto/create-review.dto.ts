import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({
    description: 'Rating from 1 to 5 stars',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({
    description: 'User feedback comment',
    example: 'Great app! The vibe matching feature is spot on.',
  })
  @IsString()
  @IsOptional()
  comment?: string;

  @ApiPropertyOptional({
    description: 'Client app version',
    example: '1.0.0',
  })
  @IsString()
  @IsOptional()
  appVersion?: string;

  @ApiPropertyOptional({
    description: 'Device info / OS version',
    example: 'iPhone 15 Pro / iOS 17.4',
  })
  @IsString()
  @IsOptional()
  deviceInfo?: string;
}

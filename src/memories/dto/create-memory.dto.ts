import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsMongoId,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateMemoryDto {
  @ApiProperty({ example: 'Sunset picnic with new friends' })
  @IsString()
  @MaxLength(120)
  title: string;

  @ApiPropertyOptional({ example: 'We met at the park challenge and stayed till dark.' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  caption?: string;

  @ApiPropertyOptional({ example: 'https://cdn.vibelink.app/m/abc.jpg' })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({ example: '665f1c2e9a1b2c3d4e5f6a7b' })
  @IsOptional()
  @IsMongoId()
  challengeId?: string;

  @ApiPropertyOptional({ example: ['Foodie', 'Chill'], isArray: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  vibeTags?: string[];
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsOptional, IsString, MaxLength } from 'class-validator';

// multipart/form-data sends every field as a string, so `vibeTags` arrives as
// a string (e.g. '["Foodie","Chill"]', 'Foodie,Chill', or just 'Foodie').
// Coerce any of those shapes into a flat string array before validation.
function toStringArray(value: unknown): unknown {
  if (Array.isArray(value)) return value.flat(Infinity).map(String);
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  if (!trimmed) return [];
  try {
    const parsed: unknown = JSON.parse(trimmed);
    if (Array.isArray(parsed)) return parsed.flat(Infinity).map(String);
    return [String(parsed)];
  } catch {
    return trimmed
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);
  }
}

export class CreateMemoryDto {
  @ApiProperty({ example: 'Sunset picnic with new friends' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'We met at the park challenge and stayed till dark.' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  caption?: string;

  // Set by uploading an `image` file (multipart) picked from the camera or
  // gallery.
  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Memory image file (camera/gallery pick). Field name: image',
  })
  image?: any;

  @ApiPropertyOptional({ example: ['Foodie', 'Chill'], isArray: true })
  @IsOptional()
  @Transform(({ value }) => toStringArray(value))
  @IsArray()
  @IsString({ each: true })
  vibeTags?: string[];
}

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { MATCH_RADIUS_METERS } from '../../common/constants/app.constants';

export class NearbyQueryDto {
  @ApiPropertyOptional({
    description: 'Search radius in meters',
    default: MATCH_RADIUS_METERS,
    example: MATCH_RADIUS_METERS,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(100)
  @Max(50000)
  radius?: number;

  @ApiPropertyOptional({ description: 'Max results', default: 20, example: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsLatitude, IsLongitude, IsNumber } from 'class-validator';

export class UpdateLocationDto {
  @ApiProperty({ example: 37.7749 })
  @IsNumber()
  @IsLatitude()
  lat: number;

  @ApiProperty({ example: -122.4194 })
  @IsNumber()
  @IsLongitude()
  lng: number;
}

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class EmergencyAlertDto {
  @ApiPropertyOptional({ example: 37.7749, description: 'Current latitude' })
  @IsOptional()
  @IsNumber()
  lat?: number;

  @ApiPropertyOptional({ example: -122.4194, description: 'Current longitude' })
  @IsOptional()
  @IsNumber()
  lng?: number;

  @ApiPropertyOptional({ example: 'Emergency SOS triggered from Safety Pulse!' })
  @IsOptional()
  @IsString()
  message?: string;
}

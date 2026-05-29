import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'jordan@vibelink.app' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'sup3r-secret' })
  @IsString()
  @MinLength(6)
  password: string;
}

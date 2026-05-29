import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'jordan@vibelink.app' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'jordan', minLength: 2, maxLength: 30 })
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  username: string;

  @ApiProperty({ example: 'sup3r-secret', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;
}

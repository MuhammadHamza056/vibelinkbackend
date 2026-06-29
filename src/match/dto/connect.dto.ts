import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class ConnectDto {
  @ApiProperty({
    description: 'Id of the user to send a connection request to',
    example: '665f1a2b3c4d5e6f7a8b9c0d',
  })
  @IsMongoId()
  userId: string;
}

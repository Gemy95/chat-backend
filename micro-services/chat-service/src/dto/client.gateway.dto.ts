import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ClientGateWayDto {
  @ApiProperty()
  @IsString()
  roomId: string;
}

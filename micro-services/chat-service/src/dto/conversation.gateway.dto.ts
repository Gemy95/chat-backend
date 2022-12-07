import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ConversationGateWayDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  createdAt?: string;
}

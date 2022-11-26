import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { Match } from '../decorator/match.decorator';

export class ResetPasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  activationCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*()_+|\?~=.-]{8,}$/, {
    message: 'Incorrect new password',
  })
  newPassword: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*()_+|\?~=.-]{8,}$/, {
    message: 'Incorrect confirm password',
  })
  @Match('newPassword', { message: "new passwords don't match" })
  confirmPassword: string;
}

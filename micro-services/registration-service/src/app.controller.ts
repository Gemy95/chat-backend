import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ExceptionFilter } from './filters/rpc-exception.filter.ts';
import { User } from './models/user.model';
import { AppService } from './app.service';
import { LoginUserDto } from './dto/login.user.dto';
import { RegisterUserDto } from './dto/register.user.dto';
import { ResetPasswordDto } from './dto/reset-password.user.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseFilters(new ExceptionFilter())
  @MessagePattern('/user/register')
  registerUser(data: RegisterUserDto): Promise<User> {
    return this.appService.registerUser(data);
  }

  @UseFilters(new ExceptionFilter())
  @MessagePattern('/user/reset-password')
  resetPasswordUser(data: ResetPasswordDto): Promise<any> {
    return this.appService.resetPasswordUser(data);
  }

  @UseFilters(new ExceptionFilter())
  @MessagePattern('/user/login')
  loginUser(data: LoginUserDto): Promise<any> {
    return this.appService.loginUser(data);
  }
}

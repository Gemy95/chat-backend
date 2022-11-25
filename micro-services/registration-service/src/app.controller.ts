import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ExceptionFilter } from '../filters/rpc-exception.filter.ts';
import { User } from '../models/user.model';
import { AppService } from './app.service';
import { RegisterUserDto } from './dto/register.user.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseFilters(new ExceptionFilter())
  @MessagePattern('/user/register')
  register(data: RegisterUserDto): Promise<User> {
    return this.appService.registerUser(data);
  }
}

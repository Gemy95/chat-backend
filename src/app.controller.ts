import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { AppService } from './app.service';
import { RegisterUserDto } from './dto/register.user.dto';

@Controller()
export class AppController {
  mailClient: ClientProxy;
  registrationClient: ClientProxy;

  constructor(private appService: AppService) {
    this.registrationClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',
        port: 8866,
      },
    });
    this.mailClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',
        port: 8877,
      },
    });
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/user/register')
  async register(@Body() data: RegisterUserDto) {
    const user = await this.registrationClient.send('/user/register', data);
    return user;
  }

  @Get('/test')
  async test(): Promise<any> {
    return await this.mailClient.send('/mail/send', {
      name: 'ali',
      email: 'ali.gamal95880@gmail',
    });
  }
}

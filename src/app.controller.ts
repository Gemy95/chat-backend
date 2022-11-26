import { BadRequestException } from '@nestjs/common';
import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { firstValueFrom, last } from 'rxjs';
import { Observable } from 'rxjs';
import { async, first } from 'rxjs';
import { SendDto } from '../micro-services/mail-service/dist/dto/send.dto';
import { User } from '../micro-services/registration-service/models/user.model';
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
        host: "127.0.0.1",
        port: 8866,
      },
    });
    this.mailClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: "127.0.0.1",
        port: 8877,
      },
    });
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post("/user/register")
  async register(@Body() registerUserDto: RegisterUserDto) {
    const user = await firstValueFrom(
       this.registrationClient.send("/user/register", registerUserDto)
    );

    await firstValueFrom(
       this.mailClient.send("/mail/send", {
        name: user["name"],
        email: user["email"],
        activationCode: user["activationCode"],
      })
    );

    return user;
  }
}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MAIL_SERVICE, REGISTRATION_SERVICE } from './common/constants';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: REGISTRATION_SERVICE,
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 8866,
        },
      },
      {
        name: MAIL_SERVICE,
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 8877,
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

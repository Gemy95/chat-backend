import { Injectable, OnModuleInit } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { AppService } from '../app.service';
import { SendDto } from '../dto/send.dto';
import { ConsumerService } from './consumer.service';

@Injectable()
export class MailConsumer implements OnModuleInit {
  constructor(
    private readonly consumerService: ConsumerService,
    private readonly appService: AppService,
  ) {}

  async onModuleInit() {
    await this.consumerService.consume({
      topic: { topics: ['mail-queue'] },
      config: { groupId: 'test-consumer' },
      onMessage: async (message) => {
        const data: SendDto = JSON.parse(message?.value?.toString());
        if (!data) {
          throw new RpcException('Error Empty Data!');
        }
        return this.appService.send(data);
      },
    });
  }
}

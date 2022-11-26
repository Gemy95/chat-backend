import { AppService } from './app.service';
import { Controller, Get, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ExceptionFilter } from './filters/rpc-exception.filter.ts';
import { SendDto } from './dto/send.dto';
import { ProducerService } from './kafka/producer.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly producerService: ProducerService,
  ) {}

  @UseFilters(new ExceptionFilter())
  @MessagePattern('/mail/send')
  async send(data: SendDto): Promise<any> {
    await this.producerService.produce('mail-queue', {
      value: Buffer.from(JSON.stringify(data)),
    });
    return this.appService.send(data);
  }
}

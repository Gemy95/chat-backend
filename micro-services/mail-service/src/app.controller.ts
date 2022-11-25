import { AppService } from './app.service';
import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ExceptionFilter } from './filters/rpc-exception.filter.ts';
import { SendDto } from './dto/send.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseFilters(new ExceptionFilter())
  @MessagePattern('/mail/send')
  send(data: SendDto): Promise<any> {
    return this.appService.send(data);
  }
}

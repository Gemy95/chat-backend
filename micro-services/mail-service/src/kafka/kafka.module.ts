import { Module } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { ProducerService } from './producer.service';
import { MailConsumer } from './mail.consumer';
import { AppService } from '../app.service';

@Module({
  imports: [],
  providers: [ProducerService, ConsumerService, MailConsumer, AppService],
  exports: [ProducerService, ConsumerService],
})
export class KafkaModule {}

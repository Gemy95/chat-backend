import { BadGatewayException, Logger } from '@nestjs/common';
import {
  Consumer,
  ConsumerConfig,
  ConsumerSubscribeTopic,
  ConsumerSubscribeTopics,
  Kafka,
  KafkaMessage,
} from 'kafkajs';
import * as retry from 'async-retry';
import { sleep } from '../utils/sleep';
import { IConsumer } from './consumer.interface';
import { RpcException } from '@nestjs/microservices';

export class KafkajsConsumer implements IConsumer {
  private readonly kafka: Kafka;
  private readonly consumer: Consumer;
  private readonly logger: Logger;

  constructor(
    private readonly topic: ConsumerSubscribeTopics,
    config: ConsumerConfig,
    broker: string,
  ) {
    this.kafka = new Kafka({ brokers: [broker] });
    this.consumer = this.kafka.consumer(config);
    this.logger = new Logger(`${topic.topics}-${config.groupId}`);
  }

  async consume(onMessage: (message: KafkaMessage) => Promise<void>) {
    await this.consumer.subscribe(this.topic);
    await this.consumer.run({
      eachMessage: async ({ message, partition }) => {
        this.logger.debug(`Processing message partition: ${partition}`);
        try {
          await retry(async () => onMessage(message), {
            retries: 3,
            onRetry: (error, attempt) =>
              this.logger.error(
                `Error consuming message, executing retry ${attempt}/3...`,
                error,
              ),
          });
        } catch (err) {
          this.logger.error(
            'Error consuming message. Adding to dead letter queue...',
            err,
          );
          throw new RpcException(err.message);
        }
      },
    });
  }

  async connect() {
    try {
      await this.consumer.connect();
    } catch (err) {
      this.logger.error('Failed to connect to Kafka.', err);
      await sleep(5000);
      await this.connect();
    }
  }

  async disconnect() {
    await this.consumer.disconnect();
  }
}

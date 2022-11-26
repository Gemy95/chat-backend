import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { REDIS_USER_NAME_SPACE } from './common/constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          readyLog: true,
          config: [
            {
              url: configService.get<string>('REDIS_URL'),
              namespace: REDIS_USER_NAME_SPACE,
              onClientCreated(client) {
                client.on('error', (err) => {
                  console.log(err);
                });
              },
            },
          ],
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

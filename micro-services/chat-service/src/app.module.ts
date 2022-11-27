import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { ClientGateWay } from './socket.gateway';
import { ConversationSchema, Conversation } from './models/conversation.model';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './models/user.model';
import { REDIS_USERS_CHAT_ROOM, REDIS_USER_MESSAGES } from './common/constants';
import { SharedAuthModule } from './authentication/shared/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URL'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Conversation.name, schema: ConversationSchema },
    ]),
    SharedAuthModule,
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          readyLog: true,
          config: [
            {
              url: configService.get<string>('REDIS_URL'),
              namespace: REDIS_USERS_CHAT_ROOM,
              onClientCreated(client) {
                client.on('error', (err) => {
                  console.log(err);
                });
              },
            },
            {
              url: configService.get<string>('REDIS_URL'),
              namespace: REDIS_USER_MESSAGES,
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
  providers: [AppService, ClientGateWay],
})
export class AppModule {}

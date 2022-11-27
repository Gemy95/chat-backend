import { RedisService } from '@liaoliaots/nestjs-redis';
import { Logger, UseFilters, UseGuards } from '@nestjs/common';
import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  ConnectedSocket,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AppService } from './app.service';
import { CurrentUser } from './authentication/shared/decorator/user.dcorator';
import { AccessTokenAuthGuard } from './authentication/shared/guards/access.token.guard';
import {
  SOCKET_USER_NAMESPACE,
  REDIS_USERS_CHAT_ROOM,
  REDIS_USER_MESSAGES,
} from './common/constants';
import { ClientGateWayDto } from './dto/client.gateway.dto';
import { ConversationGateWayDto } from './dto/conversation.gateway.dto';
import { WsExceptionsFilter } from './filters/socket.filter';

@WebSocketGateway({
  transport: ['websocket', 'polling'],
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
  namespace: SOCKET_USER_NAMESPACE,
})
@UseFilters(new WsExceptionsFilter())
export class ClientGateWay implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    private readonly redisService: RedisService,
    private readonly appService: AppService,
  ) {}
  private logger = new Logger(ClientGateWay.name);

  async handleConnection(@ConnectedSocket() socket: Socket) {
    const socketId = socket.id;
    this.logger.log(`Client new connection... socket id:`, socketId);
  }

  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    const socketId = socket.id;
    this.logger.log(`Client disconnection... socket id:`, socketId);
    this.logger.log(`Socket disconnected`);
  }

  async notifyUsersByNewMessage(data: ConversationGateWayDto): Promise<any> {
    return this.server.in(REDIS_USERS_CHAT_ROOM).emit('new-message', data);
  }

  async sendLastTenMessagesToUser(): Promise<any> {
    const messages = await this.appService.getLastUsersMessages();
    return this.server
      .in(REDIS_USERS_CHAT_ROOM)
      .emit('availble-messages', messages);
  }

  @UseGuards(AccessTokenAuthGuard)
  @SubscribeMessage('send-message')
  async onReceiveMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: ConversationGateWayDto,
    @CurrentUser() currentUser: any,
  ): Promise<any> {
    console.log('currentUser=', currentUser);
    await this.appService.createUserMessage(
      { message: data.message },
      currentUser._id,
    );
    await this.notifyUsersByNewMessage(data);
  }

  @UseGuards(AccessTokenAuthGuard)
  @SubscribeMessage('join')
  async onJoin(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: ClientGateWayDto,
  ): Promise<void | {
    success: boolean;
  }> {
    try {
      let room = await this.redisService
        .getClient(REDIS_USERS_CHAT_ROOM)
        .get(`${data.roomId}`);

      if (!room) {
        room = await this.createRoom(`${data.roomId}`);
      }
      return socket.join(`${data.roomId}`);
    } catch (error) {
      this.logger.error(error);
      return { success: false };
    }
  }

  private createRoom(room: string): Promise<'OK'> {
    return this.redisService.getClient(REDIS_USERS_CHAT_ROOM).set(room, '');
  }
}

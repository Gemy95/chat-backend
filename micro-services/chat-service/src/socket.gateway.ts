import { RedisService } from '@liaoliaots/nestjs-redis';
import {
  Logger,
  UseFilters,
  UseGuards,
  WsExceptionFilter,
} from '@nestjs/common';
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
  CHAT_ROOM,
} from './common/constants';
import { ClientGateWayDto } from './dto/client.gateway.dto';
import { ConversationGateWayDto } from './dto/conversation.gateway.dto';
import { WsExceptionsFilter } from './filters/socket.filter';
import { generateRoomValue } from './helpers/utils';

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

  async notifyUsersByNewMessage(
    socket: any,
    data: ConversationGateWayDto,
    user: any,
  ): Promise<any> {
    const roomId = await this.redisService
      .getClient(REDIS_USERS_CHAT_ROOM)
      .get(CHAT_ROOM);

    // sending to all clients in 'room' room(channel) except sender
    return socket.broadcast.to(roomId).emit('new-message', { ...data, user });
  }

  async sendLastTenMessagesToUser(socketId: string): Promise<any> {
    const messages = await this.appService.getLastUsersMessages();
    await this.server.to(socketId).emit('available-messages', messages);
  }

  @UseGuards(AccessTokenAuthGuard)
  @SubscribeMessage('send-message')
  async onReceiveMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: ConversationGateWayDto,
    @CurrentUser() currentUser: any,
  ): Promise<any> {
    const messageData = await this.appService.createUserMessage(
      data,
      currentUser._id,
    );
    console.log('messageData=', messageData);
    await this.notifyUsersByNewMessage(
      socket,
      { message: messageData.message, createdAt: messageData?.['createdAt'] },
      currentUser,
    );
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
        room = await this.createRoom(`${data.roomId}`, generateRoomValue());
      }

      const result = socket.join(room);

      await this.sendLastTenMessagesToUser(socket.id);

      return result;
    } catch (error) {
      this.logger.error(error);
      return { success: false };
    }
  }

  private createRoom(key: string, value: string) {
    this.redisService.getClient(REDIS_USERS_CHAT_ROOM).set(key, value);
    return value;
  }
}

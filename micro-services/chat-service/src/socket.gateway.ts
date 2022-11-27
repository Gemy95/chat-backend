import { RedisService } from '@liaoliaots/nestjs-redis';
import { Logger, UseFilters, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  ConnectedSocket,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Model } from 'mongoose';
import { Server, Socket } from 'socket.io';
import { CLIENT_NAMESPACE, REDIS_USER_NAME_SPACE } from './common/constants';
import { ClientGateWayDto } from './dto/client.gateway.dto';
import { ConversationGateWayDto } from './dto/conversation.gateway.dto';
import { WsExceptionsFilter } from './filters/socket.filter';
import {
  Conversation,
  ConversationDocument,
} from './models/conversation.model';

@WebSocketGateway({
  transport: ['websocket', 'polling'],
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
  namespace: CLIENT_NAMESPACE,
})
@UseFilters(new WsExceptionsFilter())
export class ClientGateWay implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    private readonly redisService: RedisService,
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConversationDocument>,
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

  async updateConversationRoomByMessage(
    data: ConversationGateWayDto,
  ): Promise<any> {
    return this.server.in(REDIS_USER_NAME_SPACE).emit('new-message', data);
  }

  // @UseGuards(JwtAuthGuard)
  @SubscribeMessage('send-message')
  async onReceiveMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: ConversationGateWayDto,
  ): Promise<any> {
    await this.conversationModel.create({
      message: data.message,
      user: data.user,
    });
    await this.updateConversationRoomByMessage(data);
  }

  // @UseGuards(JwtAuthGuard)
  @SubscribeMessage('join')
  async onJoin(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: ClientGateWayDto,
  ): Promise<void | {
    success: boolean;
  }> {
    try {
      let room = await this.redisService
        .getClient(REDIS_USER_NAME_SPACE)
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
    return this.redisService.getClient(REDIS_USER_NAME_SPACE).set(room, '');
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConversationGateWayDto } from './dto/conversation.gateway.dto';
import {
  Conversation,
  ConversationDocument,
} from './models/conversation.model';
import { User, UserDocument } from './models/user.model';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConversationDocument>,
    @InjectModel(User.name)
    private UserModel: Model<UserDocument>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async createUserMessage(data: ConversationGateWayDto, user: string) {
    await this.conversationModel.create({
      message: data.message,
      user,
    });
  }

  async getLastUsersMessages() {
    return this.conversationModel.find({}, null, { limit: 10 }).populate({
      path: 'user',
      model: 'user',
      select: { email: 1, name: 1, _id: 1 },
    });
  }
}

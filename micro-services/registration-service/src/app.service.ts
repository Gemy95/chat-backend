import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../models/user.model';
import { RegisterUserDto } from './dto/register.user.dto';
import { generateActivationCode } from '../helpers/utils';

@Injectable()
export class AppService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  registerUser(registerUserDto: RegisterUserDto): Promise<User> {
    const createdUser = new this.userModel({
      ...registerUserDto,
      activationCode: generateActivationCode(),
    });
    return createdUser.save();
  }
}

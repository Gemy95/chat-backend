import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './models/user.model';
import { RegisterUserDto } from './dto/register.user.dto';
import { generateActivationCode } from './helpers/utils';
import { LoginUserDto } from './dto/login.user.dto';
import { ResetPasswordDto } from './dto/reset-password.user.dto';
import * as bcrypt from 'bcrypt';
import { AuthService } from './authentication/shared/auth.service';
import { AuthUserType } from './authentication/shared/constants/auth.types.enum';
import { RpcException } from '@nestjs/microservices';

const SALT_OR_ROUNDS = 10;

@Injectable()
export class AppService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private authService: AuthService,
  ) {}

  registerUser(registerUserDto: RegisterUserDto) {
    const createdUser = new this.userModel({
      ...registerUserDto,
      activationCode: generateActivationCode(),
    });
    return createdUser.save();
  }

  async resetPasswordUser(resetPasswordDto: ResetPasswordDto) {
    const currentUser = await this.userModel.findOne({
      activationCode: resetPasswordDto.activationCode,
    });

    if (!currentUser) {
      throw new RpcException('This account not found');
    }

    const hashedPassword = await bcrypt.hash(
      resetPasswordDto.newPassword,
      SALT_OR_ROUNDS,
    );

    const user = await this.userModel.updateOne(
      {
        activationCode: resetPasswordDto.activationCode,
      },
      {
        password: hashedPassword,
        isActivated: true,
      },
    );

    delete user?.['password'];

    return user;
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<any> {
    const currentUser = await (
      await this.userModel.findOne({
        email: loginUserDto.email,
      })
    )?.toJSON();

    if (!currentUser) {
      throw new RpcException('This email not found');
    }

    if (!currentUser.isActivated) {
      throw new RpcException('Please Activate your account');
    }

    const isMatch = await bcrypt.compare(
      loginUserDto.passowrd,
      currentUser.password,
    );

    if (!isMatch) {
      throw new RpcException('Incorrect Password');
    }

    delete currentUser.password;

    delete currentUser.activationCode;

    const { accessToken, refreshToken } = await this.authService.generateTokens(
      AuthUserType.Client,
      currentUser,
    );

    return {
      ...currentUser,
      accessToken,
      refreshToken,
    };
  }
}

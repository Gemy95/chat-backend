import { BadRequestException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../models/user.model';
import { RegisterUserDto } from './dto/register.user.dto';
import { generateActivationCode } from '../helpers/utils';
import { LoginUserDto } from './dto/login.user.dto';
import { ResetPasswordDto } from './dto/reset-password.user.dto';
import * as bcrypt from 'bcrypt';
import { AuthService } from './authentication/shared/auth.service';
import { AuthUserType } from './authentication/shared/constants/auth.types.enum';

const SALT_OR_ROUNDS = 10;

@Injectable()
export class AppService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private authService: AuthService,
  ) {}

  registerUser(registerUserDto: RegisterUserDto): Promise<User> {
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
      throw new BadRequestException('This account not found');
    }

    const hashedPassword = await bcrypt.hash(
      resetPasswordDto.newPassword,
      SALT_OR_ROUNDS,
    );

    await this.userModel.updateOne(
      {
        activationCode: resetPasswordDto.activationCode,
      },
      {
        password: hashedPassword,
        isActivated: true,
      },
    );
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<any> {
    const currentUser = await this.userModel.findOne({
      email: loginUserDto.email,
    });

    if (!currentUser) {
      throw new BadRequestException('This email not found');
    }

    if (!currentUser.isActivated) {
      throw new BadRequestException('Please Activate your account');
    }

    const isMatch = await bcrypt.compare(
      loginUserDto.passowrd,
      currentUser.password,
    );

    if (!isMatch) {
      throw new BadRequestException('Incorrect Password');
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

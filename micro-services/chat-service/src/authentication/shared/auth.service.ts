import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { getJwtModuleOptions } from './utils/auth.jwtOptions';
import { AuthUserType } from './constants/auth.types.enum';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  generateTokens(
    authUserType: AuthUserType,
    payload: any,
  ): { accessToken: string; refreshToken: string } {
    const accessTokenOptions: JwtSignOptions = getJwtModuleOptions(
      Buffer.from(
        this.configService.get<string>(
          `ACCESS_TOKEN_${authUserType}_PRIVATE_KEY`,
        ),
        'base64',
      ).toString('ascii'),
      'RS256',
      this.configService.get<string>(`ACCESS_TOKEN_${authUserType}_EXPIRY_IN`),
      'Company',
      'iam@user.me',
      authUserType,
    );

    const accessToken = this.jwtService.sign(payload, accessTokenOptions);

    const refreshTokenOptions: JwtSignOptions = getJwtModuleOptions(
      Buffer.from(
        this.configService.get<string>(
          `REFRESH_TOKEN_${authUserType}_PRIVATE_KEY`,
        ),
        'base64',
      ).toString('ascii'),
      'RS256',
      this.configService.get<string>(`REFRESH_TOKEN_${authUserType}_EXPIRY_IN`),
      'Company',
      'iam@user.me',
      authUserType,
    );

    const refreshToken = this.jwtService.sign(payload, refreshTokenOptions);

    return {
      accessToken,
      refreshToken,
    };
  }
}

import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AccessTokenClientStrategy } from '../client/client.access.token.startegy';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { RefreshTokenClientStrategy } from '../client/client.refresh.token.startegy';
@Module({
  imports: [PassportModule, ConfigModule, JwtModule.register({})],
  providers: [
    JwtService,
    AuthService,
    AccessTokenClientStrategy,
    RefreshTokenClientStrategy,
  ],
  exports: [JwtService, AuthService],
})
export class SharedAuthModule {}

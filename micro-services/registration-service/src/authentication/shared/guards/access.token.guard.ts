import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorator/public.decorator';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AccessTokenAuthGuard extends AuthGuard([
  'AccessTokenClientStrategy',
]) {
  constructor(private reflector: Reflector, private jwtService: JwtService) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const header =
      request?.header?.('Authorization') ||
      request?.handshake?.auth?.Authorization;

    const requestType =
      request?.handshake?.query?.transport == 'websocket' ? 'SOCKET' : 'HTTP';

    if (!header && requestType == 'HTTP') {
      throw new HttpException(
        `ERROR_CODES.err_auth_token_is_missing`,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const parts = header.split(' ');
    if (
      parts.length !== 2 ||
      (parts[0] !== 'Bearer' && requestType == 'HTTP')
    ) {
      throw new HttpException(
        `ERROR_CODES.err_auth_token_is_invalid`,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const token = parts[1];

    if (!token && requestType == 'HTTP') {
      throw new UnauthorizedException(`ERROR_CODES.err_auth_token_is_missing`);
    }

    const jwtPayload = this.jwtService?.decode(token);

    if (jwtPayload && jwtPayload?.['exp'] < Date.now() / 1000) {
      throw new UnauthorizedException('Sorry, Expired Token'); // need update to use custom error
    }

    try {
      return super.canActivate(context); // verify jwt token by strategy
    } catch (error) {
      throw new UnauthorizedException(`ERROR_CODES.err_auth_token_is_invalid`);
    }
  }

  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments from startegy
    if (err || !user) {
      throw new UnauthorizedException(
        err || info?.message || `ERROR_CODES.err_auth_token_is_invalid`,
      );
    }
    return user;
  }
}
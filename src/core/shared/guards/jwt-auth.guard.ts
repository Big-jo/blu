import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthUser } from '../types';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const { user } = context
      .switchToHttp()
      .getRequest<Request & { user: AuthUser }>();

    if (!user) throw new UnauthorizedException();

    return true;
  }
}

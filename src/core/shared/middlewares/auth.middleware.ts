import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { jwtErrorHandler } from '../helpers/jwt-handler.helper';
import { AuthUser } from '../types';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(
    req: Request & { user: AuthUser; tenantId?: string },
    res: Response,
    next: NextFunction,
  ) {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ').pop();
      req.user = await jwtErrorHandler<AuthUser>(() =>
        this.jwtService.verifyAsync(token, {
          secret: process.env.JWT_SECRET,
        }),
      );
    }

    next();
  }
}

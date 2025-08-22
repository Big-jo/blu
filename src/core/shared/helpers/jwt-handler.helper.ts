import { UnauthorizedException } from '@nestjs/common/exceptions';

export const jwtErrorHandler = async <K>(fn: () => Promise<K>) => {
  const jwtTokenErrors = {
    JsonWebTokenError: () => {
      throw new UnauthorizedException('Invalid token');
    },
    TokenExpiredError: () => {
      throw new UnauthorizedException('Token expired');
    },
  };

  try {
    return await fn();
  } catch (error) {
    jwtTokenErrors[error.name]();
  }
};

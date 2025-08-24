import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentMerchant = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const { merchant } = ctx.switchToHttp().getRequest();
    return merchant;
  },
);

export const CurrentCustomer = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const { customer } = ctx.switchToHttp().getRequest();
    return customer;
  },
);

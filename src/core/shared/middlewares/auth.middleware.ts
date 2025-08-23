import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { MerchantService } from '../../../modules/merchant/merchant.service';
import { CustomerService } from '../../../modules/customer/customer.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly merchantService: MerchantService,
    private readonly customerService: CustomerService
  ) {}

  async use(req: Request & { user: any }, res: Response, next: NextFunction) {
    const apiKey = req.headers['x-api-key'] as string;
    const customerId = req.headers['x-customer-id'] as string;

    if (req.path === '/merchants' && req.method === 'POST') {
      /**
       * Ensure that the merchant creation endpoint is accessible without an API key.
       */
      return next();
    } else if (!apiKey) {
      throw new UnauthorizedException('API key is missing');
    }
    
    const merchant = await this.merchantService.findByApiKey(apiKey);
    req['merchant'] = merchant;

    if (customerId) {
      const customer = await this.customerService.findOne(customerId, merchant.id);
      req['customer'] = customer;
    }

    next();
  }
}

import { Controller, Post, Body, Headers } from '@nestjs/common';
import { ApiTags, ApiSecurity, ApiHeader } from '@nestjs/swagger';
import { CongestionService } from './congestion.service';
import { CreateTransactionDto } from 'src/modules/transaction/transaction.dto';
import {
  CurrentMerchant,
  CurrentCustomer,
} from 'src/core/shared/decorators/current-user.decorator';
import { MerchantEntity } from 'src/modules/merchant/merchant.entity';
import { CustomerEntity } from 'src/modules/customer/customer.entity';

@Controller('congestion')
@ApiTags('Congestion')
@ApiSecurity('x-api-key')
export class CongestionController {
  constructor(private readonly congestionService: CongestionService) {}

  @Post('transaction-with-delay')
  @ApiHeader({ name: 'x-idempotency-key', description: 'Idempotency key' })
  @ApiHeader({ name: 'x-customer-id', description: 'Customer ID' })
  async createTransactionWithDelay(
    @Body() createTransactionDto: CreateTransactionDto,
    @CurrentMerchant() merchant: MerchantEntity,
    @CurrentCustomer() customer: CustomerEntity,
    @Headers('x-idempotency-key') nonce: string,
  ) {
    return this.congestionService.createTransactionWithDelay(
      createTransactionDto,
      nonce,
      merchant,
      customer,
    );
  }
}

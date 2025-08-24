import { Body, Controller, Post, Headers, Req } from '@nestjs/common';
import { ApiTags, ApiSecurity, ApiHeader } from '@nestjs/swagger';
import { TransactionService } from './transaction.service';
import {
  CreateTransactionDto,
  TransactionResponseDto,
} from './transaction.dto';
import {
  CurrentCustomer,
  CurrentMerchant,
} from '../../core/shared/decorators/current-user.decorator';
import { MerchantEntity } from '../merchant/merchant.entity';
import { CustomerEntity } from '../customer/customer.entity';
import { Request } from 'express';

@Controller()
@ApiTags('Transactions')
@ApiSecurity('x-api-key')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('transactions')
  @ApiHeader({ name: 'x-idempotency-key', description: 'Idempotency key' })
  @ApiHeader({ name: 'x-customer-id', description: 'Customer ID' })
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
    @CurrentMerchant() merchant: MerchantEntity,
    @CurrentCustomer() customer: CustomerEntity,
    @Headers('x-idempotency-key') nonce: string, // ideally a unique timestamp UNIX value
    @Req() req: Request,
  ): Promise<TransactionResponseDto> {
    const requestHash = req['requestHash'];
    const transaction = await this.transactionService.create(
      createTransactionDto,
      nonce,
      requestHash,
      merchant,
      customer,
    );
    return transaction.toDto();
  }
}

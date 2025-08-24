import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from 'src/modules/transaction/transaction.dto';
import { MerchantEntity } from 'src/modules/merchant/merchant.entity';
import { CustomerEntity } from 'src/modules/customer/customer.entity';
import { TransactionService } from 'src/modules/transaction/transaction.service';
import { generateHash } from '../../core/shared/util/hash.util';

@Injectable()
export class CongestionService {
  constructor(private readonly transactionService: TransactionService) {}

  async createTransactionWithDelay(
    createTransactionDto: CreateTransactionDto,
    nonce: string,
    merchant: MerchantEntity,
    customer: CustomerEntity,
  ) {
    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 500)); // 500ms delay

    const requestHash = generateHash({ ...createTransactionDto, nonce });

    return this.transactionService.create(
      createTransactionDto,
      nonce,
      requestHash,
      merchant,
      customer,
    );
  }
}

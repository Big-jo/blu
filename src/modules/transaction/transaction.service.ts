import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { LessThan, Repository } from 'typeorm';
import { TransactionEntity } from './transaction.entity';
import { CreateTransactionDto, ListTransactionDto } from './transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerService } from '../customer/customer.service';
import { WalletService } from '../wallet/wallet.service';
import {  TRANSACTION_TYPES, TransactionStatus, TransactionStatuses } from '../../core/shared/types';
import { WalletEntity } from '../wallet/wallet.entity';
import { CustomerEntity } from '../customer/customer.entity';
import { MerchantEntity } from '../merchant/merchant.entity';
import { duplicateErrorHandler } from '../../core/shared/util/duplicate-error-handler.util';
import { PageDto } from '../pagination/page.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
    private readonly walletService: WalletService,
  ) {}

  async create(
    dto: CreateTransactionDto,
    nonce: string,
    merchant: MerchantEntity,
    customer: CustomerEntity,
  ): Promise<TransactionEntity> {
    const existingTransaction = await this.transactionRepository.findOne({
      where: { nonce, createdAt: LessThan(new Date(Date.now() + 5 * 60 * 1000)) }, // 5 minutes window
    });

    if (existingTransaction) {
      throw new UnprocessableEntityException('Invalid transaction');
    }

    const amount = parseFloat(dto.amount) * 100; // Convert dollars to cents
    const absAmount = Math.abs(amount);
    const type = amount >= 0 ? TRANSACTION_TYPES.CREDIT : TRANSACTION_TYPES.DEBIT;

    return this.transactionRepository.manager.transaction(
      'SERIALIZABLE',
      async (trx) => {
        const [customerWallet, merchantWallet] = await Promise.all([
          this.walletService.findById(customer.wallet.id),
          this.walletService.findById(merchant.wallet.id),
        ]);

        if (type === TRANSACTION_TYPES.DEBIT && customerWallet.balance < absAmount) {
          throw new BadRequestException('Insufficient funds');
        }

        if (type === TRANSACTION_TYPES.CREDIT && merchantWallet.balance < absAmount) {
          throw new BadRequestException('Merchant has insufficient funds for this transaction');
        }

        await this.walletService.updateBalance(
          trx,
          merchantWallet,
          absAmount,
          type === TRANSACTION_TYPES.DEBIT ? TRANSACTION_TYPES.CREDIT : TRANSACTION_TYPES.DEBIT, // Reverse for customer
        );

        await this.walletService.updateBalance(
          trx,
          customerWallet,
          absAmount,
          type,
        );

        const customerTrx = trx.create(TransactionEntity, {
          ...dto,
          amount,
          walletId: customerWallet.id,
          nonce,
          type,
          status: 'SUCCESS',
        });

        const merchantTrx = trx.create(TransactionEntity, {
          ...dto,
          amount: -amount, // Reverse amount for merchant
          walletId: merchantWallet.id,
          nonce,
          type: type === TRANSACTION_TYPES.DEBIT ? TRANSACTION_TYPES.CREDIT : TRANSACTION_TYPES.DEBIT,
          status: 'SUCCESS',
        });

        return trx.save(customerTrx);
      },
    );
  }

  async findAll(
    customerId: string,
    merchantId: string,
    dto: ListTransactionDto,
  ) {
    const [ result, count ] = await this.transactionRepository.findAndCount({
      where: { wallet: { customer: { id: customerId, merchant: { id: merchantId } } } },
      relations: { wallet: { customer: true, merchant: true } },
      order: { createdAt: 'DESC' },
      skip: dto.skip,
      take: dto.pageSize,
    });

    return new PageDto(result, count, dto);
  }
}

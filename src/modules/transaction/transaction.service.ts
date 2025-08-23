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
import {  TRANSACTION_TYPES, TransactionStatus } from '../../core/shared/types';
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
    //nonce should be a unique timestamp UNIX value
    const existingTransaction = await this.transactionRepository.findOne({
      where: { nonce, createdAt: LessThan(new Date(Date.now() + 5 * 60 * 1000)) }, // 5 minutes window
    });

    if (existingTransaction) {
      throw new UnprocessableEntityException("Invalid transaction")
    }

    const amount = parseFloat(dto.amount) * 100; // Convert dollars to cents
    dto.type = amount >= 0 ? TRANSACTION_TYPES.CREDIT : TRANSACTION_TYPES.DEBIT;

    const transaction = await this.transactionRepository.manager.transaction(
      'SERIALIZABLE',
      async (trx) => {
        const [customerWallet, merchantWallet] =  await Promise.all([
          this.walletService.findById(customer.wallet.id),
          this.walletService.findById(merchant.wallet.id)
        ]);

        if (dto.type === TRANSACTION_TYPES.DEBIT && customerWallet.balance < amount) {
          throw new BadRequestException('Insufficient funds');
        }

        if (dto.type === TRANSACTION_TYPES.CREDIT && merchantWallet.balance < amount) {
          throw new BadRequestException('Merchant has insufficient funds for this transaction');
        }

        // Generate random faied transaction for testing purposes
        let status: TransactionStatus = 'SUCCESS'
        if (Math.random() < 0.2) {
          throw new InternalServerErrorException('Random failure occurred while processing the transaction');
        } 

        const newCustomerBalance =
          dto.type === TRANSACTION_TYPES.CREDIT
            ? customerWallet.balance + amount
            : customerWallet.balance - amount;
        /**
         * For merchant, a DEBIT transaction means money is going out of their wallet (e.g., a refund),
         * so their balance increases. A CREDIT transaction means money is coming into their wallet
         * (e.g., a purchase), so their balance decreases.
         */
        const newMerchantBalance =
          dto.type === TRANSACTION_TYPES.CREDIT
            ? merchantWallet.balance - amount
            : merchantWallet.balance + amount;  


        const customerTrx = trx.create(TransactionEntity, {
          ...dto,
          amount,
          walletId: customerWallet.id,
          nonce,
        });

        const merchantTrx = trx.create(TransactionEntity, {
          ...dto,
          amount,
          walletId: merchantWallet.id,
          // nonce, --- IGNORE --- Internally generated transaction, no need for idempotency key
        });

        const updatedMerchantWallet = trx.create(WalletEntity, {
          ...merchantWallet,
          balance: newMerchantBalance,
        });

        const updatedCustomerWallet = trx.create(WalletEntity, {
          ...customerWallet,
          balance: newCustomerBalance,
        });


       try {
         const [wallet, savedTrx] = await Promise.all([
           trx.save(updatedCustomerWallet),
           trx.save(customerTrx),
           trx.save(updatedMerchantWallet),
           trx.save(merchantTrx),
         ]);

         return savedTrx;
       } catch (error) {
          console.error('Error creating transaction:', error);
          duplicateErrorHandler(error);
          throw new InternalServerErrorException('Failed to create transaction');
       }
      },
    );

    return transaction;
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

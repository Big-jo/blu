import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from './transaction.entity';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { CustomerModule } from '../customer/customer.module';
import { WalletModule } from '../wallet/wallet.module';
import { WalletEntity } from '../wallet/wallet.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionEntity, WalletEntity]),
    WalletModule,
  ],
  providers: [TransactionService],
  exports: [TransactionService],
  controllers: [TransactionController],
})
export class TransactionModule {}

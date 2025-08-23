import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AbstractEntity } from '../../core/shared/abstract.entity';
import { TransactionResponseDto } from './transaction.dto';
import { WalletEntity } from '../wallet/wallet.entity';
import { CustomerEntity } from '../customer/customer.entity';
import { TRANSACTION_TYPES, TransactionStatus } from '../../core/shared/types';
import { MerchantEntity } from '../merchant/merchant.entity';

@Entity({ name: 'tbl_transactions' })
export class TransactionEntity extends AbstractEntity<TransactionResponseDto> {
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column()
  type: TRANSACTION_TYPES;

  @Column('uuid')
  walletId: string;

  @Column({ unique: true, nullable: true })
  nonce: string;

  @Column({ default: 'FAILED' satisfies TransactionStatus })
  status: TransactionStatus;

  @ManyToOne(() => WalletEntity)
  @JoinColumn({ name: 'wallet_id' })
  wallet: WalletEntity;

  dtoClass = TransactionResponseDto;
}

import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AbstractEntity } from '../../core/shared/abstract.entity';
import { TransactionResponseDto } from './transaction.dto';
import { WalletEntity } from '../wallet/wallet.entity';
import { CustomerEntity } from '../customer/customer.entity';
import { TransactionType } from '../../core/shared/types';

@Entity({ name: 'tbl_transactions' })
export class TransactionEntity extends AbstractEntity<TransactionResponseDto> {
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column()
  type: TransactionType;

  // @Column('uuid')
  // walletId: string;

  // @ManyToOne(() => WalletEntity)
  // wallet: WalletEntity;

  dtoClass = TransactionResponseDto;
}

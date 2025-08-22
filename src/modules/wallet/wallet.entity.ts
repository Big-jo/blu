import { Entity, Column, ManyToOne, JoinColumn, OneToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../core/shared/abstract.entity';
import { WalletResponseDto } from './wallet.dto';
import { CustomerEntity } from '../customer/customer.entity';
import { TransactionEntity } from '../transaction/transaction.entity';

@Entity({ name: 'tbl_wallets' })
export class WalletEntity extends AbstractEntity<WalletResponseDto> {
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  balance: number;

  @Column({type: 'uuid'})
  customerId: string;

  @OneToOne(() => CustomerEntity, (customer) => customer.wallet)
  customer: CustomerEntity;

  // @OneToMany(()=> TransactionEntity, (transaction)=>transaction.wallet)
  // transactions: TransactionEntity[];

  dtoClass = WalletResponseDto;
}

import { Entity, Column, ManyToOne, JoinColumn, OneToOne, OneToMany, AfterLoad, Check } from 'typeorm';
import { AbstractEntity } from '../../core/shared/abstract.entity';
import { WalletResponseDto } from './wallet.dto';
import { CustomerEntity } from '../customer/customer.entity';
import { TransactionEntity } from '../transaction/transaction.entity';
import { MerchantEntity } from '../merchant/merchant.entity';

@Entity({ name: 'tbl_wallets' })
@Check("balance >= 0")
export class WalletEntity extends AbstractEntity<WalletResponseDto> {
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  balance: number;

  @OneToOne(() => CustomerEntity, (customer) => customer.wallet, {
    cascade: ['insert', 'update'],
    eager: true,
  })
  customer: CustomerEntity;

  @OneToOne(() => MerchantEntity, (merchant) => merchant.wallet, {
    cascade: ['insert', 'update'],
    eager: true,
  })
  merchant: MerchantEntity;

  @OneToMany(()=> TransactionEntity, (transaction)=>transaction.wallet)
  transactions: TransactionEntity[];

  dtoClass = WalletResponseDto;

  @AfterLoad()
  normalize() {
    this.balance = parseFloat(this.balance as any);
  }
}



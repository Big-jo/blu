import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
  Unique,
} from 'typeorm';
import { AbstractEntity } from '../../core/shared/abstract.entity';
import { CustomerResponseDto } from './customer.dto';
import { WalletEntity } from '../wallet/wallet.entity';
import { MerchantEntity } from '../merchant/merchant.entity';

@Entity({ name: 'tbl_customers' })
@Unique(['email', 'merchantId'])
export class CustomerEntity extends AbstractEntity<CustomerResponseDto> {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column('uuid', { name: 'merchant_id', nullable: true })
  merchantId: string;

  @ManyToOne(() => MerchantEntity, { nullable: true })
  @JoinColumn({ name: 'merchant_id' })
  merchant: MerchantEntity;

  @Column({ type: 'uuid' })
  walletId: string;

  @OneToOne(() => WalletEntity, (wallet) => wallet.customer, {
    nullable: true,
    cascade: ['insert'],
  })
  @JoinColumn({ name: 'wallet_id' })
  wallet: WalletEntity;

  dtoClass = CustomerResponseDto;
}

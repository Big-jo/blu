import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { AbstractEntity } from '../../core/shared/abstract.entity';
import { CustomerResponseDto } from './customer.dto';
import { WalletEntity } from '../wallet/wallet.entity';

@Entity({ name: 'tbl_customers' })
export class CustomerEntity extends AbstractEntity<CustomerResponseDto> {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @OneToOne(() => WalletEntity, (wallet) => wallet.customer, { cascade: ['insert'] })
  @JoinColumn()
  wallet: WalletEntity;

  dtoClass = CustomerResponseDto;
}

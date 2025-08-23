import { AbstractEntity } from '../../core/shared/abstract.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { MerchantReponseDto } from './merchant.dto';
import { WalletEntity } from '../wallet/wallet.entity';
import Joi from 'joi';

@Entity({ name: 'tbl_merchants' })
export class MerchantEntity extends AbstractEntity<MerchantReponseDto> {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  apiKey: string;

  @OneToOne(() => WalletEntity, (wallet) => wallet.merchant, {
    cascade: ['insert', 'update'],
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'wallet_id' })
  wallet: WalletEntity;

  dtoClass = MerchantReponseDto;
}

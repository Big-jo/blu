import { AbstractEntity } from 'src/core/shared/abstract.entity';
import { Column, Entity } from 'typeorm';
import { MerchantReponseDto } from './merchant.dto';

@Entity({ name: 'tbl_merchants' })
export class MerchantEntity extends AbstractEntity<MerchantReponseDto> {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  apiKey: string;

  dtoClass = MerchantReponseDto;
}

import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from '../../core/shared/abstract.dto';
import { WalletEntity } from './wallet.entity';

export class WalletResponseDto extends AbstractDto {
  @ApiProperty({
    description: 'Balance',
    example: 100.0,
  })
  balance: string;

  @ApiProperty({
    description: 'Wallet Type',
    example: ['MERCHANT', 'CUSTOMER', 'INTERNAL'],
  })
  type: string;

  constructor(entity: WalletEntity) {
    super(entity);
    this.balance = (entity.balance / 100)?.toFixed(3); // Convert cents to dollars
    this.type = entity.merchant?.id
      ? 'MERCHANT'
      : entity.customer?.id
        ? 'CUSTOMER'
        : 'INTERNAL';
  }
}

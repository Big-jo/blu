import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from '../../core/shared/abstract.dto';
import { WalletEntity } from './wallet.entity';

export class WalletResponseDto extends AbstractDto {
  @ApiProperty({
    description: 'Balance',
    example: 100.0,
  })
  balance: number;

  constructor(entity: WalletEntity) {
    super(entity);
    this.balance = entity.balance;
  }
}

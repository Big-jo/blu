import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from '../../core/shared/abstract.dto';

import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { TransactionType, TransactionTypes } from '../../core/shared/types';
import { TransactionEntity } from './transaction.entity';

export class TransactionResponseDto extends AbstractDto {
  @ApiProperty({
    description: 'Amount',
    example: 100.0,
  })
  amount: number;

  @ApiProperty({
    description: 'Transaction Type',
    // example: TransactionType.CREDIT,
  })
  type: TransactionType;

  constructor(entity: TransactionEntity) {
    super(entity);
    this.amount = entity.amount;
    this.type = entity.type;
  }
}

export class CreateTransactionDto {
  @ApiProperty({
    description: 'Amount',
    example: 100.0,
  })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({
    description: 'Transaction Type',
    example: TransactionTypes,
  })
  // @IsEnum(TransactionType)
  @IsNotEmpty()
  type: TransactionType;

  @ApiProperty({
    description: 'Wallet ID',
    example: 'uuid',
  })
  @IsString()
  @IsNotEmpty()
  walletId: string;

  @ApiProperty({
    description: 'Customer ID',
    example: 'uuid',
  })
  @IsString()
  @IsNotEmpty()
  customerId: string;
}

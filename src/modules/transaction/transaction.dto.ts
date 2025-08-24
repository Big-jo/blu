import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AbstractDto } from '../../core/shared/abstract.dto';

import {
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
} from 'class-validator';
import {
  TRANSACTION_TYPES,
  TransactionStatus,
  TransactionStatuses,
} from '../../core/shared/types';
import { TransactionEntity } from './transaction.entity';
import { Transform } from 'class-transformer';
import { PageOptionsDto } from '../pagination/page-options.dto';

export class TransactionResponseDto extends AbstractDto {
  @ApiProperty({
    description: 'Amount',
    example: '100.000',
  })
  amount: string;

  @ApiProperty({
    description: 'Transaction Type',
    example: TRANSACTION_TYPES,
  })
  type: TRANSACTION_TYPES;

  @ApiProperty({
    description: 'Customer ID',
    example: 'uuid',
  })
  customerId: string;

  @ApiProperty({
    description: 'Transaction Status',
    example: TransactionStatuses,
  })
  status: TransactionStatus;

  @ApiProperty({
    description: 'Created At',
    example: new Date(),
  })
  createdAt: Date;

  constructor(entity: TransactionEntity) {
    super(entity);
    this.amount = (entity.amount / 100).toFixed(3); // Convert cents to dollars
    this.type = entity.type;
    this.status = entity.status;
    this.customerId = entity.wallet?.customer?.id;
    this.createdAt = entity.createdAt;
  }
}

export class CreateTransactionDto {
  @ApiProperty({
    description: 'Amount in dollars',
    example: '100.0',
  })
  @IsNumberString()
  @IsNotEmpty()
  amount: string;

  type?: TRANSACTION_TYPES;
}

export class ListTransactionDto extends PageOptionsDto {
  @ApiPropertyOptional({
    description: 'Filter by Transaction Type',
    enum: TRANSACTION_TYPES,
  })
  @IsOptional()
  @IsEnum(TRANSACTION_TYPES, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  types?: TRANSACTION_TYPES[];

  @ApiPropertyOptional({
    description: 'Filter by Transaction Status',
    enum: TransactionStatuses,
  })
  @IsOptional()
  @IsEnum(TransactionStatuses)
  statuses?: TransactionStatus;
}

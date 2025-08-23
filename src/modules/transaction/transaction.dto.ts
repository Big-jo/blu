import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AbstractDto } from '../../core/shared/abstract.dto';

import { IsEnum, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, IsUUID } from 'class-validator';
import { TRANSACTION_TYPES, TransactionStatus, TransactionStatuses } from '../../core/shared/types';
import { TransactionEntity } from './transaction.entity';
import { Transform } from 'class-transformer';
import { PageOptionsDto } from '../pagination/page-options.dto';

export class TransactionResponseDto extends AbstractDto {
  @ApiProperty({
    description: 'Amount',
    example: 100.0,
  })
  amount: number;

  @ApiProperty({
    description: 'Transaction Type',
    example: TRANSACTION_TYPES
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

  constructor(entity: TransactionEntity) {
    super(entity);
    this.amount = entity.amount / 100; // Convert cents to dollars
    this.type = entity.type;
    this.status = entity.status;
  }
}

export class CreateTransactionDto {
  @ApiProperty({
    description: 'Amount in dollars',
    example: "100.0",
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

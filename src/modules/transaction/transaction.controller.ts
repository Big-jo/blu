import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags, ApiSecurity } from '@nestjs/swagger'; // Import ApiSecurity
import { TransactionService } from './transaction.service';
import {
  CreateTransactionDto,
  TransactionResponseDto,
} from './transaction.dto';

@Controller('transactions')
@ApiTags('Transactions')
@ApiSecurity('x-api-key') // Add ApiSecurity decorator
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionResponseDto> {
    const transaction =
      await this.transactionService.create(createTransactionDto);
    return transaction.toDto();
  }

  @Get()
  async findAll(): Promise<TransactionResponseDto[]> {
    const transactions = await this.transactionService.findAll();
    return transactions.map((transaction) => transaction.toDto());
  }
}

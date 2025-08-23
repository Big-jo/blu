import { Body, Controller, Get, Post, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiTags, ApiSecurity } from '@nestjs/swagger';
import { CustomerService } from './customer.service';
import { CreateCustomerDto, CustomerResponseDto } from './customer.dto';
import { MerchantEntity } from '../merchant/merchant.entity';
import { CurrentMerchant } from '../../core/shared/decorators/current-user.decorator';
import { ListTransactionDto, TransactionResponseDto } from '../transaction/transaction.dto';
import { TransactionService } from '../transaction/transaction.service';

@Controller('customers')
@ApiTags('Customers')
@ApiSecurity('x-api-key')
export class CustomerController {
  constructor(private readonly customerService: CustomerService,
  private readonly transactionService: TransactionService
  ) {}

  @Post()
  async create(
    @Body() createCustomerDto: CreateCustomerDto,
    @CurrentMerchant() merchant: MerchantEntity,
  ): Promise<CustomerResponseDto> {
    const customer = await this.customerService.create(
      createCustomerDto,
      merchant.id,
    );
    return customer.toDto();
  }

  @Get(':id/transactions')
  async findAllForCustomer(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentMerchant() merchant: MerchantEntity,
    @Query() dto: ListTransactionDto,
  ) {
    const transactions = await this.transactionService.findAll(
      id,
      merchant.id,
      dto,
    );

    return transactions;
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentMerchant() merchant: MerchantEntity,
  ): Promise<CustomerResponseDto> {
    const customer = await this.customerService.findOne(id, merchant.id);
    return customer.toDto();
  }
}

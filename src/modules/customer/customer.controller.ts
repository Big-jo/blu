import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags, ApiSecurity } from '@nestjs/swagger'; // Import ApiSecurity
import { CustomerService } from './customer.service';
import { CreateCustomerDto, CustomerResponseDto } from './customer.dto';

@Controller('customers')
@ApiTags('Customers')
@ApiSecurity('x-api-key') // Add ApiSecurity decorator
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  async create(
    @Body() createCustomerDto: CreateCustomerDto,
  ): Promise<CustomerResponseDto> {
    const customer = await this.customerService.create(createCustomerDto);
    return customer.toDto();
  }

  @Get()
  async findAll(): Promise<CustomerResponseDto[]> {
    const customers = await this.customerService.findAll();
    return customers.map((customer) => customer.toDto());
  }
}

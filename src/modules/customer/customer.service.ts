import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CustomerEntity } from './customer.entity';
import { CreateCustomerDto } from './customer.dto';
import { WalletService } from '../wallet/wallet.service';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';
import { WalletEntity } from '../wallet/wallet.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>,
    private readonly walletService: WalletService,
  ) {}

  async create(dto: CreateCustomerDto): Promise<CustomerEntity> {
    const customer = await this.customerRepository.manager.transaction(
      "SERIALIZABLE",
      async (trx) => {
        const wallet = trx.create(WalletEntity)
        const customer = trx.create(CustomerEntity, { ...dto, wallet });
        
        trx.save(customer);

        return customer;
      },
    );

    return customer;
  }

  async findAll(): Promise<CustomerEntity[]> {
    return this.customerRepository.find();
  }
}

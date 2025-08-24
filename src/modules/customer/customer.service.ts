import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CustomerEntity } from './customer.entity';
import { CreateCustomerDto } from './customer.dto';
import { WalletService } from '../wallet/wallet.service';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';
import { WalletEntity } from '../wallet/wallet.entity';
import { PageDto } from '../pagination/page.dto';
import { PageOptionsDto } from '../pagination/page-options.dto';
import { duplicateErrorHandler } from '../../core/shared/util/duplicate-error-handler.util';

@Injectable()
export class CustomerService {
  private readonly logger = new Logger(CustomerService.name);
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>,
    private readonly walletService: WalletService,
  ) {}

  async create(
    dto: CreateCustomerDto,
    merchantId: string,
  ): Promise<CustomerEntity> {
    let customer = await this.customerRepository.manager.transaction(
      'REPEATABLE READ',
      async (trx) => {
        const customerId = uuidv4();
        const wallet = trx.create(WalletEntity);
        const customer = trx.create(CustomerEntity, {
          id: customerId,
          ...dto,
          merchantId,
          wallet,
        });

        try {
          await trx.save(customer);
          return customer;
        } catch (error) {
          this.logger.error('Error creating customer:', error);
          duplicateErrorHandler(error);
        }
      },
    );

    return this.findOne(customer.id, merchantId);
  }

  async findOne(id: string, merchantId: string): Promise<CustomerEntity> {
    const customer = await this.customerRepository.findOne({
      where: { id, merchantId },
      relations: {
        wallet: { customer: true },
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }

  async findAll(merchantId: string, dto: PageOptionsDto) {
    const [result, count] = await this.customerRepository.findAndCount({
      where: { merchantId },
      skip: dto.skip,
      take: dto.pageSize,
    });

    return new PageDto(result, count, dto);
  }
}

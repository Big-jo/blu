import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MerchantEntity } from './merchant.entity';
import { CreateMerchantDto } from './merchant.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class MerchantService {
  constructor(
    @InjectRepository(MerchantEntity)
    private readonly merchantRepository: Repository<MerchantEntity>,
  ) {}

  async create(createMerchantDto: CreateMerchantDto): Promise<MerchantEntity> {
    const apiKey = `blu_${randomBytes(16).toString('hex')}`;

    return this.merchantRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const merchant = transactionalEntityManager.create(MerchantEntity, {
          ...createMerchantDto,
          apiKey,
        });

        const savedMerchant = await transactionalEntityManager.save(merchant);

        return savedMerchant;
      },
    );
  }
}

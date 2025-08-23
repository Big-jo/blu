import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MerchantEntity } from './merchant.entity';
import { CreateMerchantDto } from './merchant.dto';
import { randomBytes } from 'crypto';
import { duplicateErrorHandler } from '../../core/shared/util/duplicate-error-handler.util';
import { WalletEntity } from '../wallet/wallet.entity';
import { v4 as uuid } from 'uuid';
@Injectable()
export class MerchantService {
  constructor(
    @InjectRepository(MerchantEntity)
    private readonly merchantRepository: Repository<MerchantEntity>,
  ) { }

  async create(createMerchantDto: CreateMerchantDto): Promise<MerchantEntity> {
    const apiKey = `blu_${randomBytes(16).toString('hex')}`;

    let merchant = await this.merchantRepository.manager.transaction(
      'SERIALIZABLE',
      async (trx) => {
        const merchantId = uuid();
        const wallet = trx.create(WalletEntity, { balance: 10_000_000 }); // Initial balance of $100,000
        const merchant = trx.create(MerchantEntity, {
          id: merchantId,
          ...createMerchantDto,
          wallet,
          apiKey,
        });

        try {
          const savedMerchant = await trx.save(merchant);
          return savedMerchant;
        }
        catch (error) {
          console.error('Error creating merchant:', error);
          duplicateErrorHandler(error);
          throw new InternalServerErrorException('Failed to create merchant');
        }
      },
    );

    return this.findOne(merchant.id);
  }

  async findByApiKey(apiKey: string): Promise<MerchantEntity> {
    const merchant = await this.merchantRepository.findOne({ where: { apiKey }, relations: { wallet: true } });

    if (!merchant) {
      throw new UnauthorizedException('Invalid API key');
    }

    return this.findOne(merchant.id);
  }

  async findOne(id: string): Promise<MerchantEntity> {
    const merchant = await this.merchantRepository.findOne({
      where: { id },
      relations: {
        wallet: true
      }
    });

    if (!merchant) {
      throw new BadRequestException('Merchant not found');
    }

    return merchant;
  }
}

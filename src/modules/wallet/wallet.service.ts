import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { WalletEntity } from './wallet.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(WalletEntity)
    private readonly walletRepository: Repository<WalletEntity>,
  ) {}

  async findAll(): Promise<WalletEntity[]> {
    return this.walletRepository.find();
  }

  async create(customerId: string): Promise<WalletEntity> {
    const wallet = this.walletRepository.create();
    return this.walletRepository.save(wallet);
  }

  async findById(id: string): Promise<WalletEntity> {
    const wallet = await this.walletRepository.findOne({ where: { id } });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    return wallet;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { WalletEntity } from './wallet.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TRANSACTION_TYPES } from '../../core/shared/types';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(WalletEntity)
    private readonly walletRepository: Repository<WalletEntity>,
  ) {}

  async findAll(): Promise<WalletEntity[]> {
    return this.walletRepository.find();
  }

  async findById(id: string): Promise<WalletEntity> {
    const wallet = await this.walletRepository.findOne({ where: { id } });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    return wallet;
  }

  async updateBalance(
    trx: EntityManager,
    wallet: WalletEntity,
    amount: number,
    type: TRANSACTION_TYPES,
  ) {
    const newBalance =
      type === TRANSACTION_TYPES.CREDIT
        ? wallet.balance + amount
        : wallet.balance - amount;

    return trx.save(WalletEntity, { ...wallet, balance: newBalance });
  }
}

import {
  Injectable,
  NestMiddleware,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionEntity } from './transaction.entity';
import { generateHash } from '../../core/shared/util/hash.util';

@Injectable()
export class TransactionValidationMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const createTransactionDto = req.body;
    const requestHash = generateHash(createTransactionDto);

    const existingTransaction = await this.transactionRepository.findOne({
      where: { requestHash },
    });

    if (existingTransaction) {
      throw new UnprocessableEntityException('Duplicate transaction request');
    }

    req['requestHash'] = requestHash;
    next();
  }
}

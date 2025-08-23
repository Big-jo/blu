
import { Module } from '@nestjs/common';
import { CongestionController } from './congestion.controller';
import { CongestionService } from './congestion.service';
import { TransactionModule } from 'src/modules/transaction/transaction.module';

@Module({
  imports: [TransactionModule],
  controllers: [CongestionController],
  providers: [CongestionService],
})
export class CongestionModule {}

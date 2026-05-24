import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service.js';
import { TransactionController } from './transaction.controller.js';
import { DatabaseModule } from '../../common/database/database.module.js';
import { DatabaseService } from '../../common/database/database.service.js';
import { MedicineModule } from '../medicine-module/medicine/medicine.module.js';
import { TransactionDetailModule } from './transaction-detail/transaction-detail.module.js';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    DatabaseModule,
    MedicineModule,
    TransactionDetailModule,
    EventEmitterModule.forRoot({
      delimiter: '.',
      verboseMemoryLeak: true,
      maxListeners: 10,
      wildcard: true,
    }),
  ],
  controllers: [TransactionController],
  providers: [TransactionService,DatabaseService],
  exports: [TransactionService],
})
export class TransactionModule {}

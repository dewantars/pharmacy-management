import { Module } from '@nestjs/common';
import { FinancialReportService } from './financial-report.service.js';
import { FinancialReportController } from './financial-report.controller.js';
import { DatabaseModule } from '../../../common/database/database.module.js';
import { DatabaseService } from '../../../common/database/database.service.js';
import { MedicineOrderService } from '../../medicine-module/medicine-order/medicine-order.service.js';
import { TransactionService } from '../../transaction-module/transaction.service.js';
import { MedicineOrderModule } from '../../medicine-module/medicine-order/medicine-order.module.js';
import { TransactionModule } from '../../transaction-module/transaction.module.js';

@Module({
  imports: [DatabaseModule,MedicineOrderModule,TransactionModule],
  controllers: [FinancialReportController],
  providers: [FinancialReportService,DatabaseService],
  exports: [FinancialReportService],
})
export class FinancialReportModule {}

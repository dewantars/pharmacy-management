import { Module } from '@nestjs/common';
import { FinancialReportService } from './financial-report.service.js';
import { FinancialReportController } from './financial-report.controller.js';
import { DatabaseModule } from '../../../common/database/database.module.js';
import { DatabaseService } from '../../../common/database/database.service.js';

@Module({
  imports: [DatabaseModule],
  controllers: [FinancialReportController],
  providers: [FinancialReportService,DatabaseService],
  exports: [FinancialReportService],
})
export class FinancialReportModule {}

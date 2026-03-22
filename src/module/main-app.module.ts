import { Module } from '@nestjs/common';
import { MedicineMainModule } from './medicine-module/medicine-main.module.js';
import { ReportMainModule } from './report-module/report-main.module.js';
import { ActivityLogModule } from './logs-module/activity-log.module.js';
import { TransactionModule } from './transaction-module/transaction.module.js';
import { DatabaseModule } from '../common/database/database.module.js';
import { UsersManageModule } from './user-manage-module/users-manage.module.js';

@Module({
  imports: [
    DatabaseModule,
    MedicineMainModule,
    ReportMainModule,
    ActivityLogModule,
    TransactionModule,
    UsersManageModule,
  ],
})
export class MainAppModule {}

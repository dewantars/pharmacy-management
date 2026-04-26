import { Module } from '@nestjs/common';
import { OperationalReportService } from './operational-report.service.js';
import { OperationalReportController } from './operational-report.controller.js';
import { DatabaseModule } from '../../../common/database/database.module.js';
import { DatabaseService } from '../../../common/database/database.service.js';
import { MedicineModule } from '../../medicine-module/medicine/medicine.module.js';
import { UsersManageModule } from '../../user-manage-module/users-manage.module.js';
import { ActivityLogModule } from '../../logs-module/activity-log.module.js'

@Module({
  imports: [
      ActivityLogModule,
      DatabaseModule,
      MedicineModule,
      UsersManageModule
  ],
  controllers: [OperationalReportController],
  providers: [OperationalReportService,DatabaseService],
})
export class OperationalReportModule {}

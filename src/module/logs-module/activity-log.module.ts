import { Module } from '@nestjs/common';
import { ActivityLogService } from './activity-log.service.js';
import { ActivityLogController } from './activity-log.controller.js';
import { DatabaseModule } from '../../common/database/database.module.js';
import { DatabaseService } from '../../common/database/database.service.js';

@Module({
  controllers: [ActivityLogController],
  providers: [ActivityLogService, DatabaseService],
  imports: [DatabaseModule],
  exports: [ActivityLogService],
})
export class ActivityLogModule {}

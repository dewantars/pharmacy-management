import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service.js';
import { EmployeeController } from './employee.controller.js';
import { DatabaseModule } from '../../../common/database/database.module.js';
import { MulterModule } from '@nestjs/platform-express';
import { UploadModule } from '../../../common/helpers/upload/upload.module.js';
import { UploadService } from '../../../common/helpers/upload/upload.service.js';
import { DatabaseService } from '../../../common/database/database.service.js';

@Module({
  imports: [
    DatabaseModule,
    MulterModule.registerAsync({
      imports: [UploadModule],
      useClass: UploadService,
    }),
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService, DatabaseService, UploadService],
})
export class EmployeeModule {}

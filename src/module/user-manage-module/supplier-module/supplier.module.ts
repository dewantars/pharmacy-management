import { Module } from '@nestjs/common';
import { SupplierService } from './supplier.service.js';
import { SupplierController } from './supplier.controller.js';
import { DatabaseModule } from '../../../common/database/database.module.js';
import { DatabaseService } from '../../../common/database/database.service.js';

@Module({
  imports: [DatabaseModule],
  controllers: [SupplierController],
  providers: [SupplierService, DatabaseService],
  exports: [SupplierService],
})
export class SupplierModule {}

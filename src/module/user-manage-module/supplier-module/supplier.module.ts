import { Module } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { DatabaseModule } from '../../../common/database/database.module';
import { DatabaseService } from '../../../common/database/database.service';

@Module({
  imports: [DatabaseModule],
  controllers: [SupplierController],
  providers: [SupplierService, DatabaseService],
  exports: [SupplierService],
})
export class SupplierModule { }

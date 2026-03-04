import { Module } from '@nestjs/common';
import { MedicineService } from './medicine.service.js';
import { MedicineController } from './medicine.controller.js';
import { DatabaseModule } from '../../../common/database/database.module.js';
import { DatabaseService } from '../../../common/database/database.service.js';
import { MedicineCategoryModule } from '../medicine-category/medicine-category.module.js';
import { SupplierModule } from '../../supplier-module/supplier.module.js';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  controllers: [MedicineController],
  providers: [MedicineService, DatabaseService],
  imports: [
    DatabaseModule,
    MedicineCategoryModule,
    SupplierModule,
    EventEmitterModule.forRoot({
      delimiter: '.',
      verboseMemoryLeak: true,
      maxListeners: 10,
      wildcard: true,
    }),
  ],
  exports: [MedicineService],
})
export class MedicineModule {}

import { Module } from '@nestjs/common';
import { MedicineOrderService } from './medicine-order.service.js';
import { MedicineOrderController } from './medicine-order.controller.js';
import { DatabaseModule } from '../../../common/database/database.module.js';
import { DatabaseService } from '../../../common/database/database.service.js';
import { OrderDetailModule } from './order-detail/order-detail.module.js';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  controllers: [MedicineOrderController],
  providers: [MedicineOrderService, DatabaseService],
  imports: [
    DatabaseModule,
    OrderDetailModule,
    EventEmitterModule.forRoot({
      delimiter: '.',
      verboseMemoryLeak: true,
      maxListeners: 10,
      wildcard: true,
    }),
  ],
  exports: [MedicineOrderService],
})
export class MedicineOrderModule {}

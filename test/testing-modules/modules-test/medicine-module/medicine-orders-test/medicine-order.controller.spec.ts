import { Test, TestingModule } from '@nestjs/testing';
import { MedicineOrderController } from 'src/module/medicine-module/medicine-order/medicine-order.controller';
import { MedicineOrderService } from 'src/module/medicine-module/medicine-order/medicine-order.service';

describe('MedicineOrderController', () => {
  let controller: MedicineOrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicineOrderController],
      providers: [MedicineOrderService],
    }).compile();

    controller = module.get<MedicineOrderController>(MedicineOrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

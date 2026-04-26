import { Test, TestingModule } from '@nestjs/testing';
import { MedicineOrderService } from 'src/module/medicine-module/medicine-order/medicine-order.service';

describe('MedicineOrderService', () => {
  let service: MedicineOrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MedicineOrderService],
    }).compile();

    service = module.get<MedicineOrderService>(MedicineOrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

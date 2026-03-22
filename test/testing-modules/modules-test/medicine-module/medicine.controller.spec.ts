import { Test, TestingModule } from '@nestjs/testing';
import { MedicineController } from './medicine.controller.js';
import { MedicineService } from './medicine.service.js';

describe('MedicineController', () => {
  let controller: MedicineController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicineController],
      providers: [MedicineService],
    }).compile();

    controller = module.get<MedicineController>(MedicineController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

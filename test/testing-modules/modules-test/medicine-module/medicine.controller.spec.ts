import { Test, TestingModule } from '@nestjs/testing';
import { MedicineController } from 'src/module/medicine-module/medicine/medicine.controller';
import { MedicineService } from 'src/module/medicine-module/medicine/medicine.service';

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

jest.mock('../../../../src/common/database/database.service');
jest.mock('../../../../src/module/medicine-module/medicine-category/medicine-category.service');
jest.mock('../../../../src/module/user-manage-module/supplier-module/supplier.service');

import { Test, TestingModule } from '@nestjs/testing';
import { MedicineController } from 'src/module/medicine-module/medicine/medicine.controller';
import { MedicineService } from 'src/module/medicine-module/medicine/medicine.service';

describe('MedicineController', () => {
  let controller: MedicineController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicineController],
      providers: [
        { provide: MedicineService, useValue: mockMedicineService },
      ],
    }).compile();

    controller = module.get<MedicineController>(MedicineController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('searchByName', () => {
    it('should call searchByName and return result', async () => {
      const mockResult = [{ id: '1', medicineName: 'Paracetamol' }];
      mockMedicineService.searchByName.mockResolvedValue(mockResult);
      const result = await controller.searchByName('paracetamol');
      expect(mockMedicineService.searchByName).toHaveBeenCalledWith('paracetamol');
      expect(result).toEqual(mockResult);
    });
  });

  describe('getExpiredMedicines', () => {
    it('should call getExpiredMedicines and return result', async () => {
      const mockExpired = [{ id: '2', medicineName: 'Amoxicillin' }];
      mockMedicineService.getExpiredMedicines.mockResolvedValue(mockExpired);
      const result = await controller.getExpiredMedicines();
      expect(mockMedicineService.getExpiredMedicines).toHaveBeenCalled();
      expect(result).toEqual(mockExpired);
    });
  });
});
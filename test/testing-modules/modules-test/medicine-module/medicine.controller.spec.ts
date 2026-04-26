jest.mock('../../../../src/common/database/database.service');
jest.mock('../../../../src/module/medicine-module/medicine-category/medicine-category.service');
jest.mock('../../../../src/module/user-manage-module/supplier-module/supplier.service');

import { Test, TestingModule } from '@nestjs/testing';
import { MedicineController } from '../../../../src/module/medicine-module/medicine/medicine.controller';
import { MedicineService } from '../../../../src/module/medicine-module/medicine/medicine.service';

const mockMedicineService = {
  searchByName: jest.fn(),
  getExpiredMedicines: jest.fn(),
  findLowStock: jest.fn(),
  findByCategory: jest.fn(),
  findBySupplier: jest.fn(),
};

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

  // (1) DHEA — test endpoint mendapatkan daftar obat dengan stok rendah
  describe('findLowStock', () => {
    it('should call findLowStock with provided threshold', async () => {
      const mockResult = [{ id: '1', stock: 5 }];
      mockMedicineService.findLowStock.mockResolvedValue(mockResult);

      const result = await controller.findLowStock('5');

      expect(mockMedicineService.findLowStock).toHaveBeenCalledWith(5);
      expect(result).toEqual(mockResult);
    });

    it('should use default threshold 10 when not provided', async () => {
      const mockResult: any[] = [];
      mockMedicineService.findLowStock.mockResolvedValue(mockResult);

      const result = await controller.findLowStock(undefined);

      expect(mockMedicineService.findLowStock).toHaveBeenCalledWith(10);
      expect(result).toEqual(mockResult);
    });
  });

  // (2) DHEA — test endpoint mendapatkan daftar obat berdasarkan kategori
  describe('findByCategory', () => {
    it('should call findByCategory and return result', async () => {
      const mockResult = [
        { id: '1', medicineName: 'Paracetamol', categoryId: 'category-1' },
      ];

      mockMedicineService.findByCategory.mockResolvedValue(mockResult);

      const result = await controller.findByCategory('category-1');

      expect(mockMedicineService.findByCategory).toHaveBeenCalledWith('category-1');
      expect(result).toEqual(mockResult);
    });
  });

  // (3) DHEA — test endpoint mendapatkan daftar obat berdasarkan supplier
  describe('findBySupplier', () => {
    it('should call findBySupplier and return result', async () => {
      const mockResult = [{ id: '1', supplierId: 'sup-1' }];

      mockMedicineService.findBySupplier.mockResolvedValue(mockResult);

      const result = await controller.findBySupplier('sup-1');

      expect(mockMedicineService.findBySupplier).toHaveBeenCalledWith('sup-1');
      expect(result).toEqual(mockResult);
    });
  });
});
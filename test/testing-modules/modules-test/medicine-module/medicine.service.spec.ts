import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';

jest.mock('../../../../src/common/database/database.service');
jest.mock('../../../../src/module/medicine-module/medicine-category/medicine-category.service');
jest.mock('../../../../src/module/user-manage-module/supplier-module/supplier.service');

import { MedicineService } from '../../../../src/module/medicine-module/medicine/medicine.service';
import { DatabaseService } from '../../../../src/common/database/database.service';
import { MedicineCategoryService } from '../../../../src/module/medicine-module/medicine-category/medicine-category.service';
import { SupplierService } from '../../../../src/module/user-manage-module/supplier-module/supplier.service';

const mockPrisma = {
  medicine: {
    findMany: jest.fn(),
  },
};

describe('MedicineService', () => {
  let service: MedicineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MedicineService,
        { provide: DatabaseService, useValue: mockPrisma },
        { provide: MedicineCategoryService, useValue: {} },
        { provide: SupplierService, useValue: {} },
        { provide: EventEmitter2, useValue: { emit: jest.fn() } },
      ],
    }).compile();

    service = module.get<MedicineService>(MedicineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('searchByName', () => {
    it('should return medicines matching the name', async () => {
      const mockResult = [{ id: '1', medicineName: 'Paracetamol', stock: 10 }];
      mockPrisma.medicine.findMany.mockResolvedValue(mockResult);
      const result = await service.searchByName('paracetamol');
      expect(mockPrisma.medicine.findMany).toHaveBeenCalledWith({
        where: { medicineName: { contains: 'paracetamol', mode: 'insensitive' } },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockResult);
    });

    it('should return empty array if no medicine matches', async () => {
      mockPrisma.medicine.findMany.mockResolvedValue([]);
      const result = await service.searchByName('tidakada');
      expect(result).toEqual([]);
    });
  });

  describe('getExpiredMedicines', () => {
    it('should return expired medicines', async () => {
      const mockExpired = [{ id: '2', medicineName: 'Amoxicillin', expiredDate: new Date('2024-01-01') }];
      mockPrisma.medicine.findMany.mockResolvedValue(mockExpired);
      const result = await service.getExpiredMedicines();
      expect(mockPrisma.medicine.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockExpired);
    });

    it('should return empty array if no expired medicines', async () => {
      mockPrisma.medicine.findMany.mockResolvedValue([]);
      const result = await service.getExpiredMedicines();
      expect(result).toEqual([]);
    });
  });
});
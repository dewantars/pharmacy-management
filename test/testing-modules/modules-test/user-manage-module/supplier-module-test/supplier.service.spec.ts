jest.mock('../../../../../src/common/database/database.service');

import { Test, TestingModule } from '@nestjs/testing';
import { SupplierService } from '../../../../../src/module/user-manage-module/supplier-module/supplier.service';
import { DatabaseService } from '../../../../../src/common/database/database.service';

const mockPrisma = {
  supplier: {
    findMany: jest.fn(),
  },
};

describe('SupplierService', () => {
  let service: SupplierService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupplierService,
        { provide: DatabaseService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<SupplierService>(SupplierService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('searchByName', () => {
    it('should return suppliers matching the name', async () => {
      const mockResult = [{ id: '1', supplierName: 'Kimia Farma' }];
      mockPrisma.supplier.findMany.mockResolvedValue(mockResult);
      const result = await service.searchByName('kimia');
      expect(mockPrisma.supplier.findMany).toHaveBeenCalledWith({
        where: { supplierName: { contains: 'kimia', mode: 'insensitive' } },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockResult);
    });

    it('should return empty array if no supplier matches', async () => {
      mockPrisma.supplier.findMany.mockResolvedValue([]);
      const result = await service.searchByName('tidakada');
      expect(result).toEqual([]);
    });
  });
});
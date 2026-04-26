jest.mock('../../../../../src/common/database/database.service');

import { Test, TestingModule } from '@nestjs/testing';
import { SupplierController } from '../../../../../src/module/user-manage-module/supplier-module/supplier.controller';
import { SupplierService } from '../../../../../src/module/user-manage-module/supplier-module/supplier.service';

const mockSupplierService = {
  searchByName: jest.fn(),
};

describe('SupplierController', () => {
  let controller: SupplierController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SupplierController],
      providers: [
        { provide: SupplierService, useValue: mockSupplierService },
      ],
    }).compile();

    controller = module.get<SupplierController>(SupplierController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('searchByName', () => {
    it('should call searchByName and return result', async () => {
      const mockResult = [{ id: '1', supplierName: 'Kimia Farma' }];
      mockSupplierService.searchByName.mockResolvedValue(mockResult);
      const result = await controller.searchByName('kimia');
      expect(mockSupplierService.searchByName).toHaveBeenCalledWith('kimia');
      expect(result).toEqual(mockResult);
    });
  });
});
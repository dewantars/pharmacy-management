jest.mock('../../../../../src/common/database/database.service');

import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SupplierController } from 'src/module/user-manage-module/supplier-module/supplier.controller';
import { SupplierService } from 'src/module/user-manage-module/supplier-module/supplier.service';

jest.mock('src/module/user-manage-module/supplier-module/supplier.service', () => ({
  SupplierService: jest.fn(),
}));
jest.mock(
  'src/module/user-manage-module/supplier-module/dto/create-supplier.dto',
  () => ({}),
);
jest.mock(
  'src/module/user-manage-module/supplier-module/dto/update-supplier.dto',
  () => ({}),
);
jest.mock('src/common/security/guards/roles.decorator', () => ({
  Roles: () => () => { },
}));

describe('SupplierController', () => {
  let controller: SupplierController;
  let service: jest.Mocked<SupplierService>;

  const mockSupplierService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockSupplier = {
    id: 'sup-1',
    name: 'PT Kimia Farma',
    phone: '08123456789',
    address: 'Jakarta',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SupplierController],
      providers: [
        {
          provide: SupplierService,
          useValue: mockSupplierService,
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({
        canActivate: (_context: ExecutionContext) => true,
      })
      .compile();

    controller = module.get<SupplierController>(SupplierController);
    service = module.get(SupplierService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ─── create ───────────────────────────────────────────────────────────────

  describe('create', () => {
    it('should call service.create with dto and return the result', async () => {
      const mockDto = {
        name: 'PT Kimia Farma',
        phone: '08123456789',
        address: 'Jakarta',
      } as any;

      mockSupplierService.create.mockResolvedValue(mockSupplier);

      const result = await controller.create(mockDto);

      expect(service.create).toHaveBeenCalledWith(mockDto);
      expect(result).toEqual(mockSupplier);
    });

    it('should propagate errors thrown by service.create', async () => {
      mockSupplierService.create.mockRejectedValue(
        new Error('Unique constraint failed'),
      );

      await expect(controller.create({} as any)).rejects.toThrow(
        'Unique constraint failed',
      );
    });
  });

  // ─── findAll ──────────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('should call service.findAll with page and perPage and return the result', async () => {
      const mockPaginatedResult = {
        data: [mockSupplier],
        meta: { total: 1, currentPage: 1, perPage: 10, lastPage: 1 },
      };

      mockSupplierService.findAll.mockResolvedValue(mockPaginatedResult);

      const result = await controller.findAll(1, 10);

      expect(service.findAll).toHaveBeenCalledWith(1, 10);
      expect(result).toEqual(mockPaginatedResult);
    });

    it('should call service.findAll with undefined when query params are not provided', async () => {
      const mockResult = { data: [], meta: { total: 0 } };

      mockSupplierService.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll(undefined, undefined);

      expect(service.findAll).toHaveBeenCalledWith(undefined, undefined);
      expect(result).toEqual(mockResult);
    });

    it('should propagate errors thrown by service.findAll', async () => {
      mockSupplierService.findAll.mockRejectedValue(new Error('Database error'));

      await expect(controller.findAll(1, 10)).rejects.toThrow('Database error');
    });
  });

  // ─── findOne ──────────────────────────────────────────────────────────────

  describe('findOne', () => {
    it('should call service.findOne with the given id and return the result', async () => {
      const mockSupplierWithRelation = {
        ...mockSupplier,
        medicines: [],
        medicineOrders: [],
      };

      mockSupplierService.findOne.mockResolvedValue(mockSupplierWithRelation);

      const result = await controller.findOne('sup-1');

      expect(service.findOne).toHaveBeenCalledWith('sup-1');
      expect(result).toEqual(mockSupplierWithRelation);
    });

    it('should propagate NotFoundException thrown by service.findOne', async () => {
      mockSupplierService.findOne.mockRejectedValue(
        new Error('supplier with ID invalid-id not found'),
      );

      await expect(controller.findOne('invalid-id')).rejects.toThrow(
        'supplier with ID invalid-id not found',
      );
    });
  });

  // ─── update ───────────────────────────────────────────────────────────────

  describe('update', () => {
    it('should call service.update with id and dto and return the result', async () => {
      const mockDto = { name: 'PT Kimia Farma Updated' } as any;
      const mockUpdated = { ...mockSupplier, name: 'PT Kimia Farma Updated' };

      mockSupplierService.update.mockResolvedValue(mockUpdated);

      const result = await controller.update('sup-1', mockDto);

      expect(service.update).toHaveBeenCalledWith('sup-1', mockDto);
      expect(result).toEqual(mockUpdated);
    });

    it('should propagate errors thrown by service.update', async () => {
      mockSupplierService.update.mockRejectedValue(
        new Error('Supplier not found'),
      );

      await expect(
        controller.update('invalid-id', {} as any),
      ).rejects.toThrow('Supplier not found');
    });
  });

  // ─── remove ───────────────────────────────────────────────────────────────

  describe('remove', () => {
    it('should call service.remove with the given id and return the result', async () => {
      mockSupplierService.remove.mockResolvedValue(mockSupplier);

      const result = await controller.remove('sup-1');

      expect(service.remove).toHaveBeenCalledWith('sup-1');
      expect(result).toEqual(mockSupplier);
    });

    it('should propagate errors thrown by service.remove', async () => {
      mockSupplierService.remove.mockRejectedValue(
        new Error('Supplier not found'),
      );

      await expect(controller.remove('invalid-id')).rejects.toThrow(
        'Supplier not found',
      );
    });
  });
});
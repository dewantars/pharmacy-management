jest.mock('../../../../../src/common/database/database.service');

import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { SupplierService } from 'src/module/user-manage-module/supplier-module/supplier.service';
import { DatabaseService } from 'src/common/database/database.service';

// ─── Solusi hoisting: simpan mock di dalam factory, akses lewat require() ────
// jest.mock() selalu di-hoist ke paling atas oleh Jest (bahkan sebelum const/let),
// sehingga variabel yang dideklarasi di luar factory tidak bisa direferensikan.
// Solusinya: buat mock function di dalam factory dan ekspos lewat properti khusus.
jest.mock('src/common/helpers/pagination/pagination', () => {
  const mockPaginateFn = jest.fn();
  return {
    paginator: () => mockPaginateFn,
    __mockPaginate: mockPaginateFn,
  };
});

describe('SupplierService', () => {
  let service: SupplierService;
  let prisma: DatabaseService;
  // Diakses lewat require() setelah jest.mock sudah berjalan
  let mockPaginate: jest.Mock;

  const mockDatabaseService = {
    supplier: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockSupplier = {
    id: 'sup-1',
    name: 'PT Kimia Farma',
    phone: '08123456789',
    address: 'Jakarta',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockSupplierWithRelation = {
    ...mockSupplier,
    medicines: [{ id: 'med-1', medicineName: 'Paracetamol' }],
    medicineOrders: [{ id: 'order-1', totalPrice: 500000 }],
  };

  beforeEach(async () => {
    // Ambil referensi mockPaginateFn yang sudah dibuat di factory
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    mockPaginate = require('src/common/helpers/pagination/pagination').__mockPaginate;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupplierService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<SupplierService>(SupplierService);
    prisma = module.get<DatabaseService>(DatabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ─── create ───────────────────────────────────────────────────────────────

  describe('create', () => {
    it('should create a supplier and return it', async () => {
      const mockDto = {
        name: 'PT Kimia Farma',
        phone: '08123456789',
        address: 'Jakarta',
      } as any;

      (prisma.supplier.create as jest.Mock).mockResolvedValue(mockSupplier);

      const result = await service.create(mockDto);

      expect(prisma.supplier.create).toHaveBeenCalledWith({ data: mockDto });
      expect(result).toEqual(mockSupplier);
    });

    it('should propagate errors thrown by prisma.supplier.create', async () => {
      (prisma.supplier.create as jest.Mock).mockRejectedValue(
        new Error('Unique constraint failed'),
      );

      await expect(service.create({} as any)).rejects.toThrow(
        'Unique constraint failed',
      );
    });
  });

  // ─── findAll ──────────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('should call paginate with correct args and return paginated suppliers', async () => {
      const mockPaginatedResult = {
        data: [mockSupplier],
        meta: { total: 1, currentPage: 1, perPage: 10, lastPage: 1 },
      };

      mockPaginate.mockResolvedValue(mockPaginatedResult);

      const result = await service.findAll(1, 10);

      expect(mockPaginate).toHaveBeenCalledWith(
        prisma.supplier,
        { orderBy: { createdAt: 'desc' } },
        { page: 1, perPage: 10 },
      );
      expect(result).toEqual(mockPaginatedResult);
    });

    it('should return empty data when no suppliers exist', async () => {
      const mockEmptyResult = {
        data: [],
        meta: { total: 0, currentPage: 1, perPage: 10, lastPage: 1 },
      };

      mockPaginate.mockResolvedValue(mockEmptyResult);

      const result = await service.findAll(1, 10);

      expect(result).toEqual(mockEmptyResult);
    });
  });

  // ─── findOne ──────────────────────────────────────────────────────────────

  describe('findOne', () => {
    it('should return a supplier with relations when found', async () => {
      (prisma.supplier.findUnique as jest.Mock).mockResolvedValue(
        mockSupplierWithRelation,
      );

      const result = await service.findOne('sup-1');

      expect(prisma.supplier.findUnique).toHaveBeenCalledWith({
        where: { id: 'sup-1' },
        include: {
          medicines: { orderBy: { createdAt: 'desc' } },
          medicineOrders: { orderBy: { createdAt: 'desc' } },
        },
      });
      expect(result).toEqual(mockSupplierWithRelation);
    });

    it('should throw NotFoundException when supplier is not found', async () => {
      (prisma.supplier.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOne('invalid-id')).rejects.toThrow(
        'supplier with ID invalid-id not found',
      );
    });
  });

  // ─── update ───────────────────────────────────────────────────────────────

  describe('update', () => {
    it('should update a supplier and return the updated data', async () => {
      const mockDto = { name: 'PT Kimia Farma Updated' } as any;
      const mockUpdated = { ...mockSupplier, name: 'PT Kimia Farma Updated' };

      (prisma.supplier.update as jest.Mock).mockResolvedValue(mockUpdated);

      const result = await service.update('sup-1', mockDto);

      expect(prisma.supplier.update).toHaveBeenCalledWith({
        where: { id: 'sup-1' },
        data: mockDto,
      });
      expect(result).toEqual(mockUpdated);
    });

    it('should propagate errors thrown by prisma.supplier.update', async () => {
      (prisma.supplier.update as jest.Mock).mockRejectedValue(
        new Error('Record not found'),
      );

      await expect(service.update('invalid-id', {} as any)).rejects.toThrow(
        'Record not found',
      );
    });
  });

  // ─── remove ───────────────────────────────────────────────────────────────

  describe('remove', () => {
    it('should delete a supplier and return the deleted data', async () => {
      (prisma.supplier.delete as jest.Mock).mockResolvedValue(mockSupplier);

      const result = await service.remove('sup-1');

      expect(prisma.supplier.delete).toHaveBeenCalledWith({
        where: { id: 'sup-1' },
      });
      expect(result).toEqual(mockSupplier);
    });

    it('should propagate errors thrown by prisma.supplier.delete', async () => {
      (prisma.supplier.delete as jest.Mock).mockRejectedValue(
        new Error('Record not found'),
      );

      await expect(service.remove('invalid-id')).rejects.toThrow(
        'Record not found',
      );
    });
  });
});
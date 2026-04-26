import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from 'src/module/transaction-module/transaction.controller';
import { TransactionService } from 'src/module/transaction-module/transaction.service';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';

describe('TransactionController', () => {
  let controller: TransactionController;
  let service: TransactionService;

  const mockTransactionService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: TransactionService,
          useValue: mockTransactionService,
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({
        canActivate: (context: ExecutionContext) => true,
      })
      .compile();

    controller = module.get<TransactionController>(TransactionController);
    service = module.get<TransactionService>(TransactionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ─── create ───────────────────────────────────────────────────────────────

  describe('create', () => {
    it('should call service.create with correct arguments and return the result', async () => {
      const mockDto = {
        employeeId: '550e8400-e29b-41d4-a716-446655440000',
        transactionDate: new Date(),
        cashReceived: 100,
        discount: 20,
        medicines: [{ medicineId: 'm1', quantity: 2 }],
      } as any;

      const mockUserId = 'user-123';
      const mockResult = { id: 'txn-1', totalPrice: 80 };

      mockTransactionService.create.mockResolvedValue(mockResult);

      const result = await controller.create(mockDto, mockUserId);

      expect(service.create).toHaveBeenCalledWith(mockDto, mockUserId);
      expect(result).toEqual(mockResult);
    });

    it('should propagate errors thrown by service.create', async () => {
      const mockDto = {
        employeeId: '550e8400-e29b-41d4-a716-446655440000',
        transactionDate: new Date(),
        cashReceived: 10,
        discount: 0,
        medicines: [{ medicineId: 'm1', quantity: 2 }],
      } as any;

      mockTransactionService.create.mockRejectedValue(
        new Error('Insufficient cash'),
      );

      await expect(controller.create(mockDto, 'user-123')).rejects.toThrow(
        'Insufficient cash',
      );
    });
  });

  // ─── findAll ──────────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('should call service.findAll with page and perPage and return the result', async () => {
      const mockResult = {
        data: [{ id: 'txn-1' }, { id: 'txn-2' }],
        total: 2,
      };

      mockTransactionService.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll(1, 10);

      expect(service.findAll).toHaveBeenCalledWith(10, 1);
      expect(result).toEqual(mockResult);
    });

    it('should call service.findAll with undefined when page and perPage are not provided', async () => {
      const mockResult = { data: [], total: 0 };

      mockTransactionService.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll(undefined, undefined);

      expect(service.findAll).toHaveBeenCalledWith(undefined, undefined);
      expect(result).toEqual(mockResult);
    });
  });

  // ─── findOne ──────────────────────────────────────────────────────────────

  describe('findOne', () => {
    it('should call service.findOne with the given id and return the result', async () => {
      const mockTransaction = { id: 'txn-1', totalPrice: 80 };

      mockTransactionService.findOne.mockResolvedValue(mockTransaction);

      const result = await controller.findOne('txn-1');

      expect(service.findOne).toHaveBeenCalledWith('txn-1');
      expect(result).toEqual(mockTransaction);
    });

    it('should propagate errors thrown by service.findOne', async () => {
      mockTransactionService.findOne.mockRejectedValue(
        new Error('Transaction not found'),
      );

      await expect(controller.findOne('invalid-id')).rejects.toThrow(
        'Transaction not found',
      );
    });
  });

  // ─── update ───────────────────────────────────────────────────────────────

  describe('update', () => {
    it('should call service.update with id and dto and return the result', async () => {
      const mockDto = { cashReceived: 200 } as any;
      const mockUpdated = { id: 'txn-1', cashReceived: 200 };

      mockTransactionService.update.mockResolvedValue(mockUpdated);

      const result = await controller.update('txn-1', mockDto);

      expect(service.update).toHaveBeenCalledWith('txn-1', mockDto);
      expect(result).toEqual(mockUpdated);
    });

    it('should propagate errors thrown by service.update', async () => {
      mockTransactionService.update.mockRejectedValue(
        new Error('Transaction not found'),
      );

      await expect(
        controller.update('invalid-id', {} as any),
      ).rejects.toThrow('Transaction not found');
    });
  });

  // ─── remove ───────────────────────────────────────────────────────────────

  describe('remove', () => {
    it('should call service.remove with the given id and return the result', async () => {
      const mockRemoved = { id: 'txn-1', deleted: true };

      mockTransactionService.remove.mockResolvedValue(mockRemoved);

      const result = await controller.remove('txn-1');

      expect(service.remove).toHaveBeenCalledWith('txn-1');
      expect(result).toEqual(mockRemoved);
    });

    it('should propagate errors thrown by service.remove', async () => {
      mockTransactionService.remove.mockRejectedValue(
        new Error('Transaction not found'),
      );

      await expect(controller.remove('invalid-id')).rejects.toThrow(
        'Transaction not found',
      );
    });
  });
});
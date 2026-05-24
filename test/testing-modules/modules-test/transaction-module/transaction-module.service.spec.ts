describe('TransactionModule', () => {
  it('should be defined', () => {
    expect(true).toBe(true);
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from 'src/module/transaction-module/transaction.service';
import { DatabaseService } from 'src/common/database/database.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MedicineService } from 'src/module/medicine-module/medicine/medicine.service';

describe('TransactionService', () => {
  let service: TransactionService;
  let prisma: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: DatabaseService,
          useValue: {
            $transaction: jest.fn().mockImplementation(async (callback) => {
              return callback(prisma);
            }),
            medicine: {
              findUnique: jest.fn(),
              update: jest.fn(),
            },
            transaction: {
              create: jest.fn(),
              aggregate: jest.fn(),
            },
          },
        },
        {
          provide: MedicineService,
          useValue: {},
        },
        {
          provide: EventEmitter2,
          useValue: { emit: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    prisma = module.get<DatabaseService>(DatabaseService);
  });

  describe('create with discount', () => {
    it('should calculate grandTotal with discount correctly', async () => {
      const mockDto = {
        employeeId: '550e8400-e29b-41d4-a716-446655440000',
        transactionDate: new Date(),
        cashReceived: 100,
        discount: 20,
        medicines: [{ medicineId: 'm1', quantity: 2 }],
      } as any;

      (prisma.medicine.findUnique as jest.Mock).mockResolvedValue({
        id: 'm1',
        price: 50,
        stock: 10,
        medicineName: 'Paracetamol',
      });

      (prisma.medicine.update as jest.Mock).mockResolvedValue({
        stock: 8,
      });

      (prisma.transaction.create as jest.Mock).mockImplementation((args) => args.data);

      const result = await service.create(mockDto, '1');

      // 2 * 50 = 100 subtotal. Discount 20 -> grandTotal = 80
      expect(result.totalPrice).toBe(80);
      expect(prisma.transaction.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            totalPrice: 80,
          }),
        })
      );
    });

    it('should not throw if cash is enough after discount', async () => {
      const mockDto = {
        employeeId: '550e8400-e29b-41d4-a716-446655440000',
        transactionDate: new Date(),
        cashReceived: 100,
        discount: 20,
        medicines: [{ medicineId: 'm1', quantity: 2 }],
      } as any;

      (prisma.medicine.findUnique as jest.Mock).mockResolvedValue({
        id: 'm1',
        price: 50,
        stock: 10,
        medicineName: 'Paracetamol',
      });

      (prisma.medicine.update as jest.Mock).mockResolvedValue({
        stock: 8,
      });

      (prisma.transaction.create as jest.Mock).mockImplementation((args) => args.data);

      await expect(service.create(mockDto, '1')).resolves.toBeDefined();
    });
  });

  describe('calculateTotalRevenue', () => {
    it('should aggregate totalPrice and return the sum', async () => {
      (prisma.transaction.aggregate as jest.Mock).mockResolvedValue({
        _sum: { totalPrice: 1500 },
      });

      const result = await service.calculateTotalRevenue();
      expect(result).toBe(1500);
      expect(prisma.transaction.aggregate).toHaveBeenCalledWith({
        _sum: { totalPrice: true },
        where: {},
      });
    });

    it('should aggregate totalPrice with date range', async () => {
      (prisma.transaction.aggregate as jest.Mock).mockResolvedValue({
        _sum: { totalPrice: 500 },
      });

      const startDate = new Date('2023-01-01');
      const endDate = new Date('2023-01-31');

      const result = await service.calculateTotalRevenue(startDate, endDate);
      expect(result).toBe(500);
      expect(prisma.transaction.aggregate).toHaveBeenCalledWith({
        _sum: { totalPrice: true },
        where: {
          transactionDate: {
            gte: startDate,
            lte: endDate,
          },
        },
      });
    });

    it('should return 0 if there is no revenue', async () => {
      (prisma.transaction.aggregate as jest.Mock).mockResolvedValue({
        _sum: { totalPrice: null },
      });

      const result = await service.calculateTotalRevenue();
      expect(result).toBe(0);
    });
  });
});
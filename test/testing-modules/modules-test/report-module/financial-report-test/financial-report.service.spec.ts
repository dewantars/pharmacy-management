import { Test, TestingModule } from '@nestjs/testing';
import { FinancialReportService } from 'src/module/report-module/financial-report/financial-report.service';
import { MedicineOrderService } from 'src/module/medicine-module/medicine-order/medicine-order.service';
import { TransactionService } from 'src/module/transaction-module/transaction.service';
import { DatabaseService } from 'src/common/database/database.service';
import { Response } from 'express';

describe('FinancialReportService', () => {
  let service: FinancialReportService;
  let db: DatabaseService;

  const mockPrisma = {
    transaction: {
      findMany: jest.fn(),
    },
    medicineOrder: {
      findMany: jest.fn(),
    },
  };

  const mockMedicineOrderService = {
      findAll: jest.fn(),
  };

  const mockTransactionService = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FinancialReportService,
        { provide: DatabaseService, useValue: mockPrisma },
        { provide: MedicineOrderService, useValue: mockMedicineOrderService },
        { provide: TransactionService, useValue: mockTransactionService },
      ],
    }).compile();

    service = module.get<FinancialReportService>(FinancialReportService);
    db = module.get<DatabaseService>(DatabaseService);
  });

  it('harus menghitung data finansial dengan benar', async () => {
    mockPrisma.transaction.findMany.mockResolvedValue([
      { totalPrice: 100000, transactionDetails: [] },
      { totalPrice: 50000, transactionDetails: [] },
    ]);

    mockPrisma.medicineOrder.findMany.mockResolvedValue([
      {
        totalPrice: 40000,
        orderDetails: [{ quantity: 5 }, { quantity: 5 }],
      },
    ]);

    const result = await service.getFinancialData();

    expect(result.summary.totalIncome).toBe(150000);
    expect(result.summary.totalExpenses).toBe(40000);
    expect(result.summary.totalRestocked).toBe(10);
    expect(result.summary.netProfit).toBe(110000);
    expect(result.summary.avgSpending).toBe(40000);
  });

  it('harus mengembalikan angka nol jika data kosong', async () => {
    mockPrisma.transaction.findMany.mockResolvedValue([]);
    mockPrisma.medicineOrder.findMany.mockResolvedValue([]);

    const result = await service.getFinancialData();

    expect(result.summary.totalIncome).toBe(0);
    expect(result.summary.avgSpending).toBe(0);
  });
});

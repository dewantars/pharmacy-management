import { BadRequestException } from '@nestjs/common';

class TransactionService {
  constructor(private prisma: any) {}

  async generateMonthlyReport(month: number, year: number) {
    if (month < 1 || month > 12) {
      throw new BadRequestException('Bulan harus antara 1 sampai 12');
    }
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);
    const transactions = await this.prisma.transaction.findMany({
      where: { transactionDate: { gte: startDate, lt: endDate } },
      include: {
        employee: { select: { name: true, empId: true, role: true } },
        transactionDetails: {
          include: { medicine: { select: { medicineName: true, sku: true } } },
        },
      },
      orderBy: { transactionDate: 'asc' },
    });
    const totalTransactions = transactions.length;
    const totalRevenue = transactions.reduce((sum: number, trx: any) => sum + trx.totalPrice, 0);
    const averageTransactionValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
    return { month, year, totalTransactions, totalRevenue, averageTransactionValue, transactions };
  }

  async getTotalOrderValuePerSupplier(supplierId?: string) {
    const whereClause: any = {};
    if (supplierId) whereClause.supplierId = supplierId;
    const orders = await this.prisma.medicineOrder.findMany({
      where: whereClause,
      include: { supplier: { select: { id: true, supplierName: true } } },
      orderBy: { orderDate: 'desc' },
    });
    const supplierMap = new Map<string, any>();
    for (const order of orders) {
      const key = order.supplierId;
      if (!supplierMap.has(key)) {
        supplierMap.set(key, {
          supplierId: order.supplier.id,
          supplierName: order.supplier.supplierName,
          orders: [],
        });
      }
      supplierMap.get(key).orders.push({ totalPrice: order.totalPrice, orderDate: order.orderDate });
    }
    const result: any[] = [];
    for (const [, data] of supplierMap) {
      const totalOrders = data.orders.length;
      const totalOrderValue = data.orders.reduce((sum: number, o: any) => sum + o.totalPrice, 0);
      const averageOrderValue = totalOrders > 0 ? totalOrderValue / totalOrders : 0;
      const lastOrderDate = data.orders.length > 0
        ? data.orders.reduce((latest: any, o: any) => o.orderDate > latest.orderDate ? o : latest).orderDate
        : null;
      result.push({ supplierId: data.supplierId, supplierName: data.supplierName, totalOrders, totalOrderValue, averageOrderValue, lastOrderDate });
    }
    result.sort((a, b) => b.totalOrderValue - a.totalOrderValue);
    return result;
  }

  async findByFilter(dto: any, perPage: number, page: number) {
    const { status, month, year } = dto;
    const where: any = {};
    if (month !== undefined || year !== undefined) {
      const now = new Date();
      const filterYear = year ?? now.getFullYear();
      const filterMonth = month ?? now.getMonth() + 1;
      where.transactionDate = { gte: new Date(filterYear, filterMonth - 1, 1), lt: new Date(filterYear, filterMonth, 1) };
    }
    if (status === 'PAID') where.totalPrice = { gt: 0 };
    else if (status === 'UNPAID') where.totalPrice = { equals: 0 };
    return await this.prisma.transaction.findMany({ where, orderBy: { transactionDate: 'desc' } });
  }
}


const mockPrisma = {
  transaction: { findMany: jest.fn(), findUniqueOrThrow: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn() },
  medicineOrder: { findMany: jest.fn() },
  $transaction: jest.fn(),
};

const mockTransactions = [
  { id: 'trx-1', transactionCode: 'TRC-ABC123', totalPrice: 150000, employeeId: 'emp-1', transactionDate: new Date('2025-05-10'), createdAt: new Date('2025-05-10'), updatedAt: new Date('2025-05-10'), employee: { name: 'Budi', empId: 'EMP-001', role: 'CASHIER' }, transactionDetails: [] },
  { id: 'trx-2', transactionCode: 'TRC-DEF456', totalPrice: 75000, employeeId: 'emp-2', transactionDate: new Date('2025-05-15'), createdAt: new Date('2025-05-15'), updatedAt: new Date('2025-05-15'), employee: { name: 'Ani', empId: 'EMP-002', role: 'CASHIER' }, transactionDetails: [] },
];

const mockMedicineOrders = [
  { id: 'ord-1', orderCode: 'ORD-AAA', totalPrice: 500000, supplierId: 'sup-1', employeeId: 'emp-1', orderDate: new Date('2025-05-01'), status: 'COMPLETED', supplier: { id: 'sup-1', supplierName: 'Supplier Kimia Farma' } },
  { id: 'ord-2', orderCode: 'ORD-BBB', totalPrice: 300000, supplierId: 'sup-1', employeeId: 'emp-1', orderDate: new Date('2025-05-20'), status: 'PENDING', supplier: { id: 'sup-1', supplierName: 'Supplier Kimia Farma' } },
  { id: 'ord-3', orderCode: 'ORD-CCC', totalPrice: 750000, supplierId: 'sup-2', employeeId: 'emp-2', orderDate: new Date('2025-04-15'), status: 'COMPLETED', supplier: { id: 'sup-2', supplierName: 'Supplier Indo Farma' } },
];

describe('TransactionService - Fitur Baru', () => {
  let service: TransactionService;

  beforeEach(() => {
    service = new TransactionService(mockPrisma);
    jest.clearAllMocks();
  });

  describe('generateMonthlyReport()', () => {
    it('harus mengembalikan laporan bulanan yang benar untuk bulan Mei 2025', async () => {
      mockPrisma.transaction.findMany.mockResolvedValue(mockTransactions);
      const result = await service.generateMonthlyReport(5, 2025);
      expect(result.month).toBe(5);
      expect(result.year).toBe(2025);
      expect(result.totalTransactions).toBe(2);
      expect(result.totalRevenue).toBe(225000);
      expect(result.averageTransactionValue).toBe(112500);
    });

    it('harus mengembalikan laporan kosong jika tidak ada transaksi', async () => {
      mockPrisma.transaction.findMany.mockResolvedValue([]);
      const result = await service.generateMonthlyReport(1, 2025);
      expect(result.totalTransactions).toBe(0);
      expect(result.totalRevenue).toBe(0);
      expect(result.averageTransactionValue).toBe(0);
    });

    it('harus melempar BadRequestException jika bulan tidak valid (0)', async () => {
      await expect(service.generateMonthlyReport(0, 2025)).rejects.toThrow(BadRequestException);
    });

    it('harus melempar BadRequestException jika bulan tidak valid (13)', async () => {
      await expect(service.generateMonthlyReport(13, 2025)).rejects.toThrow(BadRequestException);
    });

    it('harus memanggil findMany dengan rentang tanggal yang tepat', async () => {
      mockPrisma.transaction.findMany.mockResolvedValue([]);
      await service.generateMonthlyReport(3, 2025);
      expect(mockPrisma.transaction.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { transactionDate: { gte: new Date(2025, 2, 1), lt: new Date(2025, 3, 1) } },
        }),
      );
    });
  });

  describe('getTotalOrderValuePerSupplier()', () => {
    it('harus mengembalikan summary semua supplier', async () => {
      mockPrisma.medicineOrder.findMany.mockResolvedValue(mockMedicineOrders);
      const result = await service.getTotalOrderValuePerSupplier();
      expect(result).toHaveLength(2);
      expect(result[0].supplierName).toBe('Supplier Kimia Farma');
      expect(result[0].totalOrderValue).toBe(800000);
      expect(result[0].totalOrders).toBe(2);
      expect(result[0].averageOrderValue).toBe(400000);
    });

    it('harus mengembalikan summary hanya untuk supplier tertentu', async () => {
      const sup1Orders = mockMedicineOrders.filter((o) => o.supplierId === 'sup-1');
      mockPrisma.medicineOrder.findMany.mockResolvedValue(sup1Orders);
      const result = await service.getTotalOrderValuePerSupplier('sup-1');
      expect(result).toHaveLength(1);
      expect(result[0].supplierId).toBe('sup-1');
      expect(result[0].totalOrders).toBe(2);
      expect(result[0].totalOrderValue).toBe(800000);
    });

    it('harus mengembalikan array kosong jika tidak ada pesanan', async () => {
      mockPrisma.medicineOrder.findMany.mockResolvedValue([]);
      const result = await service.getTotalOrderValuePerSupplier();
      expect(result).toHaveLength(0);
    });

    it('harus mengembalikan lastOrderDate yang benar', async () => {
      const sup1Orders = mockMedicineOrders.filter((o) => o.supplierId === 'sup-1');
      mockPrisma.medicineOrder.findMany.mockResolvedValue(sup1Orders);
      const result = await service.getTotalOrderValuePerSupplier('sup-1');
      expect(result[0].lastOrderDate).toEqual(new Date('2025-05-20'));
    });

    it('harus mengurutkan hasil berdasarkan totalOrderValue descending', async () => {
      mockPrisma.medicineOrder.findMany.mockResolvedValue(mockMedicineOrders);
      const result = await service.getTotalOrderValuePerSupplier();
      for (let i = 0; i < result.length - 1; i++) {
        expect(result[i].totalOrderValue).toBeGreaterThanOrEqual(result[i + 1].totalOrderValue);
      }
    });
  });

  describe('findByFilter()', () => {
    it('harus tidak throw error saat dipanggil dengan filter bulan dan tahun', async () => {
      mockPrisma.transaction.findMany.mockResolvedValue([]);
      await expect(service.findByFilter({ month: 5, year: 2025 }, 10, 1)).resolves.toBeDefined();
    });

    it('harus tidak throw error saat dipanggil tanpa filter', async () => {
      mockPrisma.transaction.findMany.mockResolvedValue([]);
      await expect(service.findByFilter({}, 10, 1)).resolves.toBeDefined();
    });
  });
});
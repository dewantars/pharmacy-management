import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { FilterTransactionDto } from './dto/filter-transaction.dto';
import { DatabaseService } from '../../common/database/database.service';
import {
  PaginatedResult,
  paginator,
} from '../../common/helpers/pagination/pagination';
import {
  Prisma,
  Transaction,
} from '../../common/database/generated/prisma/client';
import { TransactionUpdateInput } from '../../common/database/generated/prisma/models';
import { MedicineService } from '../medicine-module/medicine/medicine.service';
import { TransactionData } from './interface/transaction-data.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';

const paginate = paginator({ perPage: 10, page: 1 });

type TransactionDataWithRelation = Prisma.TransactionGetPayload<{
  include: { _count: true; transactionDetails: true; employee: true };
}>;

export interface MonthlyTransactionReport {
  month: number;
  year: number;
  totalTransactions: number;
  totalRevenue: number;
  averageTransactionValue: number;
  transactions: Transaction[];
}

export interface SupplierOrderSummary {
  supplierId: string;
  supplierName: string;
  totalOrders: number;
  totalOrderValue: number;
  averageOrderValue: number;
  lastOrderDate: Date | null;
}

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);
  constructor(
    private prisma: DatabaseService,
    private medicineService: MedicineService,
    private event: EventEmitter2,
  ) { }

  async create(dto: CreateTransactionDto, id?: string): Promise<Transaction> {
    const { employeeId, medicines, transactionDate, discount } = dto;

    return await this.prisma.$transaction(async (tx: any) => {
      let grandTotal = 0;
      const orderItemsData: TransactionData[] = [];

      for (const item of medicines) {
        this.logger.debug(item.medicineId);
        const medicine = await tx.medicine.findUnique({
          where: { id: item.medicineId },
        });

        if (!medicine) {
          throw new BadRequestException(
            `Medicine dengan ID ${item.medicineId} tidak ditemukan.`,
          );
        }

        if (medicine.stock < item.quantity) {
          throw new BadRequestException(
            `Stok ${medicine.medicineName} tidak cukup. Sisa stok: ${medicine.stock}`,
          );
        }

        const updatedMedicine = await tx.medicine.update({
          where: { id: item.medicineId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });

        const subtotal = medicine.price * item.quantity;
        grandTotal += subtotal;

        orderItemsData.push({
          medicineId: item.medicineId,
          quantity: item.quantity,
          unitPrice: medicine.price,
          subtotal: subtotal,
        });

        if (updatedMedicine.stock <= 15) {
          this.event.emit('medicine.low-stock', {
            medicineName: medicine.medicineName,
            medicineStock: medicine.stock,
            orderOperation: Date.now(),
          });
          this.logger.warn(
            `Peringatan: Stok obat ${medicine.medicineName} rendah (${updatedMedicine.stock}).`,
          );
        }
      }

      if (discount) {
        grandTotal -= discount;
        if (grandTotal < 0) grandTotal = 0;
      }

      if (dto.cashReceived < grandTotal) {
        throw new BadRequestException(
          `Uang pembayaran kurang! Total: ${grandTotal}`,
        );
      }

      return await tx.transaction.create({
        data: {
          transactionDate: transactionDate,
          transactionCode: `TRC-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
          totalPrice: grandTotal,
          employee: {
            connect: { id: id ?? employeeId },
          },
          transactionDetails: {
            create: orderItemsData,
          },
        },
        include: {
          transactionDetails: true,
        },
      });
    });
  }

  async findAll(
    perPage: number,
    page: number,
  ): Promise<PaginatedResult<Transaction>> {
    return await paginate(
      this.prisma.transaction,
      {
        orderBy: { createdAt: 'desc' },
        include: {
          employee: { omit: { id: true, password: true } },
          transactionDetails: true,
        },
      },
      { perPage, page },
    );
  }

  async findOne(id: string): Promise<TransactionDataWithRelation> {
    return await this.prisma.transaction.findUniqueOrThrow({
      where: { id: id },
      include: {
        _count: true,
        transactionDetails: true,
        employee: true,
      },
    });
  }

  async update(
    id: string,
    dto: UpdateTransactionDto,
  ): Promise<Transaction | TransactionUpdateInput> {
    return await this.prisma.transaction.update({
      where: { id: id },
      data: dto,
    });
  }

  async remove(id: string): Promise<Transaction> {
    return await this.prisma.transaction.delete({
      where: { id: id },
    });
  }

  async calculateTotalRevenue(startDate?: Date, endDate?: Date): Promise<number> {
    const whereClause: Prisma.TransactionWhereInput = {};

    if (startDate || endDate) {
      whereClause.transactionDate = {};
      if (startDate) {
        whereClause.transactionDate.gte = startDate;
      }
      if (endDate) {
        whereClause.transactionDate.lte = endDate;
      }
    }

    const result = await this.prisma.transaction.aggregate({
      _sum: {
        totalPrice: true,
      },
      where: whereClause,
    });

    return result._sum.totalPrice || 0;
  }
 

  // FUnny : fitur transaksi filter berdasarkan status (PAID/UNPAID) dan bulan/tahun
  async findByFilter(
    dto: FilterTransactionDto,
    perPage: number,
    page: number,
  ): Promise<PaginatedResult<Transaction>> {
    const { status, month, year } = dto;
    const where: Prisma.TransactionWhereInput = {};

    if (month !== undefined || year !== undefined) {
      const now = new Date();
      const filterYear = year ?? now.getFullYear();
      const filterMonth = month ?? now.getMonth() + 1;
      const startDate = new Date(filterYear, filterMonth - 1, 1);
      const endDate = new Date(filterYear, filterMonth, 1);
      where.transactionDate = { gte: startDate, lt: endDate };
    }

    if (status === 'PAID') {
      where.totalPrice = { gt: 0 };
    } else if (status === 'UNPAID') {
      where.totalPrice = { equals: 0 };
    }

    return await paginate(
      this.prisma.transaction,
      {
        where,
        orderBy: { transactionDate: 'desc' },
        include: {
          employee: { omit: { id: true, password: true } },
          transactionDetails: {
            include: {
              medicine: { select: { medicineName: true, sku: true } },
            },
          },
        },
      },
      { perPage, page },
    );
  }

  // =============================================
  // FITUR 2: Laporan Transaksi Bulanan
  // =============================================
  async generateMonthlyReport(
    month: number,
    year: number,
  ): Promise<MonthlyTransactionReport> {
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
          include: {
            medicine: { select: { medicineName: true, sku: true } },
          },
        },
      },
      orderBy: { transactionDate: 'asc' },
    });

    const totalTransactions = transactions.length;
    const totalRevenue = transactions.reduce((sum, trx) => sum + trx.totalPrice, 0);
    const averageTransactionValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

    this.logger.log(`Laporan bulanan ${month}/${year}: ${totalTransactions} transaksi, total Rp${totalRevenue}`);

    return { month, year, totalTransactions, totalRevenue, averageTransactionValue, transactions };
  }

  // =============================================
  // FITUR 3: Total Nilai Pesanan Per Supplier
  // =============================================
  async getTotalOrderValuePerSupplier(
    supplierId?: string,
  ): Promise<SupplierOrderSummary[]> {
    const whereClause: Prisma.MedicineOrderWhereInput = {};
    if (supplierId) whereClause.supplierId = supplierId;

    const orders = await this.prisma.medicineOrder.findMany({
      where: whereClause,
      include: { supplier: { select: { id: true, supplierName: true } } },
      orderBy: { orderDate: 'desc' },
    });

    const supplierMap = new Map<string, {
      supplierId: string;
      supplierName: string;
      orders: { totalPrice: number; orderDate: Date }[];
    }>();

    for (const order of orders) {
      const key = order.supplierId;
      if (!supplierMap.has(key)) {
        supplierMap.set(key, {
          supplierId: order.supplier.id,
          supplierName: order.supplier.supplierName,
          orders: [],
        });
      }
      supplierMap.get(key)!.orders.push({
        totalPrice: order.totalPrice,
        orderDate: order.orderDate,
      });
    }

    const result: SupplierOrderSummary[] = [];
    for (const [, data] of supplierMap) {
      const totalOrders = data.orders.length;
      const totalOrderValue = data.orders.reduce((sum, o) => sum + o.totalPrice, 0);
      const averageOrderValue = totalOrders > 0 ? totalOrderValue / totalOrders : 0;
      const lastOrderDate = data.orders.length > 0
        ? data.orders.reduce((latest, o) => o.orderDate > latest.orderDate ? o : latest).orderDate
        : null;
      result.push({
        supplierId: data.supplierId,
        supplierName: data.supplierName,
        totalOrders,
        totalOrderValue,
        averageOrderValue,
        lastOrderDate,
      });
    }

    result.sort((a, b) => b.totalOrderValue - a.totalOrderValue);
    return result;
  }
}
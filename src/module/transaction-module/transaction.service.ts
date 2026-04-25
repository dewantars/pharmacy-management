import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto.js';
import { UpdateTransactionDto } from './dto/update-transaction.dto.js';
import { DatabaseService } from '../../common/database/database.service.js';
import {
  PaginatedResult,
  paginator,
} from '../../common/helpers/pagination/pagination.js';
import {
  Prisma,
  Transaction,
} from '../../common/database/generated/prisma/client.js';
import { TransactionUpdateInput } from '../../common/database/generated/prisma/models.js';
import { MedicineService } from '../medicine-module/medicine/medicine.service.js';
import { TransactionData } from './interface/transaction-data.interface.js';
import { EventEmitter2 } from '@nestjs/event-emitter';

const paginate = paginator({ perPage: 10, page: 1 });

type TransactionDataWithRelation = Prisma.TransactionGetPayload<{
  include: { _count: true; transactionDetails: true; employee: true };
}>;

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);
  constructor(
    private prisma: DatabaseService,
    private medicineService: MedicineService,
    private event: EventEmitter2,
  ) {}

  async create(dto: CreateTransactionDto, id?: string): Promise<Transaction> {
    const { employeeId, medicines, transactionDate } = dto;

    return await this.prisma.$transaction(async (tx) => {
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
}

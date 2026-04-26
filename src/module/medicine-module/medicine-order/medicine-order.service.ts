import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateMedicineOrderDto } from './dto/create-medicine-order.dto.js';
import { UpdateMedicineOrderDto } from './dto/update-medicine-order.dto.js';
import {
  MedicineOrder,
  Prisma,
} from '../../../common/database/generated/prisma/client.js';
import { MedicineUpdateInput } from '../../../common/database/generated/prisma/models.js';
import {
  PaginatedResult,
  paginator,
} from '../../../common/helpers/pagination/pagination.js';
import { DatabaseService } from '../../../common/database/database.service.js';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Medicines } from './interfaces/medicines.interface.js';
const paginate = paginator({ perPage: 10, page: 1 });

type MedicineOrderWithRelations = Prisma.MedicineOrderGetPayload<{
  include: { _count: true; supplier: true; employee: true };
}>;

@Injectable()
export class MedicineOrderService {
  private readonly logger = new Logger(MedicineOrderService.name);
  constructor(
    private prisma: DatabaseService,
    private event: EventEmitter2,
  ) {}

  async create(dto: CreateMedicineOrderDto): Promise<MedicineOrder> {
    const { supplierId, employeeId, medicines, ...request } = dto;

    return await this.prisma.$transaction(async (tx) => {
      let grandTotal = 0;
      const orderItemsData: Medicines[] = [];

      for (const item of medicines) {
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

      // Validasi pembayaran
      // if (dto.cashReceived < grandTotal) {
      //   throw new BadRequestException(`Uang pembayaran kurang! Total: ${grandTotal}`);
      // }

      return await tx.medicineOrder.create({
        data: {
          ...request,
          orderCode: `ORD-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
          totalPrice: grandTotal,
          employee: {
            connect: { id: employeeId },
          },
          supplier: {
            connect: { id: supplierId },
          },
          orderDetails: {
            create: orderItemsData,
          },
        },
        include: {
          orderDetails: true,
        },
      });
    });
  }

  async findAll(
    perPage: number,
    page: number,
  ): Promise<PaginatedResult<MedicineOrder>> {
    return await paginate(
      this.prisma.medicineOrder,
      {
        orderBy: { createdAt: 'desc' },
        include: {
          supplier: { omit: { id: true } },
          employee: { omit: { id: true } },
        },
        omit: { employeeId: true, supplierId: true },
      },
      { page, perPage },
    );
  }

  async findOne(id: string): Promise<MedicineOrderWithRelations> {
    return await this.prisma.medicineOrder.findUniqueOrThrow({
      where: { id: id },
      include: {
        _count: true,
        supplier: true,
        employee: true,
      },
    });
  }

  async update(
    id: string,
    dto: UpdateMedicineOrderDto,
  ): Promise<MedicineOrder | MedicineUpdateInput> {
    return await this.prisma.medicineOrder.update({
      where: { id: id },
      data: dto,
    });
  }

  async remove(id: string): Promise<MedicineOrder> {
    return await this.prisma.medicineOrder.delete({
      where: { id: id },
    });
  }
}

//

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateMedicineDto } from './dto/create-medicine.dto.js';
import { UpdateMedicineDto } from './dto//update-medicine.dto.js';
import {
  PaginatedResult,
  paginator,
} from '../../../common/pagination/pagination.js';
import {
  Medicine,
  Prisma,
} from '../../../common/database/generated/prisma/client.js';
import { DatabaseService } from '../../../common/database/database.service.js';
import {
  MedicineCreateInput,
  MedicineUpdateInput,
} from '../../../common/database/generated/prisma/models.js';
import { MedicineCategoryService } from '../medicine-category/medicine-category.service.js';
import { SupplierService } from '../../supplier-module/supplier.service.js';
import { EventEmitter2 } from '@nestjs/event-emitter';

const paginate = paginator({ perPage: 10, page: 1 });

type MedicineWithRelations = Prisma.MedicineGetPayload<{
  include: {
    _count: true;
    category: true;
    supplier: true;
  };
}>;

@Injectable()
export class MedicineService {
  private readonly logger = new Logger(MedicineService.name);
  constructor(
    private prisma: DatabaseService,
    private medicineCategoryService: MedicineCategoryService,
    private supplierService: SupplierService,
    private event: EventEmitter2,
  ) {}

  async create(
    dto: CreateMedicineDto,
  ): Promise<Medicine | MedicineCreateInput> {
    const category = await this.medicineCategoryService.findOne(dto.categoryId);
    const supplier = await this.supplierService.findOne(dto.supplierId);

    if (!category && !supplier) {
      throw new NotFoundException('Category or Supplier data is not found');
    }

    const { supplierId, categoryId, ...restData } = dto;
    return await this.prisma.medicine.create({
      data: {
        ...restData,
        supplier: {
          connect: {
            id: supplierId,
          },
        },
        category: {
          connect: {
            id: categoryId,
          },
        },
      },
    });
  }

  async findAll(
    page: number,
    perPage: number,
  ): Promise<PaginatedResult<Medicine>> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiredCount = await this.prisma.medicine.count({
      where: {
        expiredDate: {
          lt: today,
        },
      },
    });

    if (expiredCount > 0) {
      this.event.emit('medicine.expired_detected', {
        count: expiredCount,
        detectedAt: new Date(),
      });

      this.logger.warn(`${expiredCount} obat kedaluwarsa ditemukan.`);
    }

    return paginate(
      this.prisma.medicine,
      {
        include: {
          category: {
            omit: { id: true },
          },
          supplier: {
            omit: { id: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        omit: {
          categoryId: true,
          supplierId: true,
        },
      },
      { page, perPage },
    );
  }

  async findOne(id: string): Promise<MedicineWithRelations> {
    return this.prisma.medicine.findUniqueOrThrow({
      where: { id: id },
      include: {
        _count: true,
        category: true,
        supplier: true,
      },
    });
  }

  async update(
    id: string,
    dto: UpdateMedicineDto,
  ): Promise<Medicine | MedicineUpdateInput> {
    return await this.prisma.medicine.update({
      where: { id: id },
      data: dto,
    });
  }

  async remove(id: string): Promise<Medicine> {
    return await this.prisma.medicine.delete({
      where: { id: id },
    });
  }
}

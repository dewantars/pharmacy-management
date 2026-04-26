import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto.js';
import { UpdateSupplierDto } from './dto/update-supplier.dto.js';
import { DatabaseService } from '../../../common/database/database.service.js';
import {
  Prisma,
  Supplier,
} from '../../../common/database/generated/prisma/client.js';
import {
  PaginatedResult,
  paginator,
} from '../../../common/helpers/pagination/pagination.js';

const paginate = paginator({ perPage: 10, page: 1 });

type SupplierWithRelation = Prisma.SupplierGetPayload<{
  include: {
    medicines: true;
    medicineOrders: true;
  };
}>;
@Injectable()
export class SupplierService {
  private readonly logger = new Logger(SupplierService.name);
  constructor(private prisma: DatabaseService) {}

  async create(dto: CreateSupplierDto): Promise<Supplier> {
    return this.prisma.supplier.create({
      data: dto,
    });
  }

  async findAll(
    page: number,
    perPage: number,
  ): Promise<PaginatedResult<Supplier>> {
    return paginate(
      this.prisma.supplier,
      { orderBy: { createdAt: 'desc' } },
      { page, perPage },
    );
  }

  async findOne(id: string): Promise<SupplierWithRelation> {
    const supplier = await this.prisma.supplier.findUnique({
      where: { id },
      include: {
        medicines: { orderBy: { createdAt: 'desc' } },
        medicineOrders: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!supplier) {
      throw new NotFoundException(`supplier with ID ${id} not found`);
    }

    return supplier;
  }

  // (3) DINA — menambahkan fitur/function pencarian supplier berdasarkan nama
  async searchByName(name: string): Promise<Supplier[]> {
    return this.prisma.supplier.findMany({
      where: {
        supplierName: {
          contains: name,
          mode: 'insensitive',
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, dto: UpdateSupplierDto): Promise<Supplier> {
    return this.prisma.supplier.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string): Promise<Supplier> {
    return this.prisma.supplier.delete({
      where: { id },
    });
  }
}

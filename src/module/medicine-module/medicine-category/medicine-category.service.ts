import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateMedicineCategoryDto } from './dto/create-medicine-category.dto';
import { UpdateMedicineCategoryDto } from './dto/update-medicine-category.dto';
import {
  PaginatedResult,
  paginator,
} from '../../../common/helpers/pagination/pagination';
import {
  MedicineCategory,
  Prisma,
} from '../../../common/database/generated/prisma/client';
import { DatabaseService } from '../../../common/database/database.service';
import {
  MedicineCategoryCreateInput,
  MedicineCategoryUpdateInput,
} from '../../../common/database/generated/prisma/models';

const paginate = paginator({ perPage: 10, page: 1 });

type MedicineCategoryWithMedicine = Prisma.MedicineCategoryGetPayload<{
  include: {
    medicines: true;
  };
}>;

@Injectable()
export class MedicineCategoryService {
  private readonly logger = new Logger(MedicineCategoryService.name);
  constructor(private prisma: DatabaseService) { }

  async create(
    dto: CreateMedicineCategoryDto,
  ): Promise<MedicineCategory | MedicineCategoryCreateInput> {
    return this.prisma.medicineCategory.create({
      data: dto,
    });
  }

  async findAll(
    page: number,
    perPage: number,
  ): Promise<PaginatedResult<MedicineCategory>> {
    return paginate(
      this.prisma.medicineCategory,
      { orderBy: { createdAt: 'desc' } },
      { page, perPage },
    );
  }

  async findOne(id: string): Promise<MedicineCategoryWithMedicine> {
    const category = await this.prisma.medicineCategory.findUnique({
      where: { id },
      include: { medicines: { orderBy: { createdAt: 'desc' } } },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async update(
    id: string,
    dto: UpdateMedicineCategoryDto,
  ): Promise<MedicineCategory | MedicineCategoryUpdateInput> {
    return this.prisma.medicineCategory.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string): Promise<MedicineCategory> {
    return this.prisma.medicineCategory.delete({
      where: { id },
    });
  }
}

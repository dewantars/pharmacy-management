import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto.js';
import { UpdateEmployeeDto } from './dto/update-employee.dto.js';
import { DatabaseService } from '../../../common/database/database.service.js';
import {
  PaginatedResult,
  paginator,
} from '../../../common/helpers/pagination/pagination.js';
import {
  Prisma,
  Employee,
} from '../../../common/database/generated/prisma/client.js';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcrypt';

const paginate = paginator({ perPage: 10, page: 1 });

const saltRounds = 10;

type EmployeeDataWithRelation = Prisma.EmployeeGetPayload<{
  include: {
    medicineOrders: true;
    transactions: true;
  };
}>;

@Injectable()
export class EmployeeService {
  private logger = new Logger(EmployeeService.name);
  constructor(private prisma: DatabaseService) {}

  async create(
    dto: CreateEmployeeDto,
    file: Express.Multer.File,
  ): Promise<Employee> {
    const hash = await bcrypt.hash(dto.password, saltRounds);

    if (file != null) {
      const employeeData = {
        ...dto,
        password: hash,
        provileAvatar: file.filename,
      };

      return await this.prisma.employee.create({
        data: employeeData,
      });
    }
    const userData = {
      ...dto,
      password: hash,
    };

    return await this.prisma.employee.create({
      data: userData,
    });
  }

  async findAll(page: number, perPage: number): Promise<PaginatedResult<Employee>> {
    return await paginate(
      this.prisma.employee,
      { orderBy: { createdAt: 'desc' } },
      { page, perPage },
    );
  }

  async findOne(id: string): Promise<EmployeeDataWithRelation> {
    const employee = await this.prisma.employee.findUnique({
      where: { id },
      include: {
        _count: true,
        medicineOrders: true,
        transactions: true,
      },
    });

    if (!employee) {
      throw new NotFoundException(`employee with ID ${id} not found`);
    }

    return employee;
  }

  async update(
    id: string,
    dto: UpdateEmployeeDto,
    file: Express.Multer.File,
  ): Promise<Employee> {
    const existingEmployee = await this.prisma.employee.findUnique({
      where: { id: id },
    });
    const hash = await bcrypt.hash(dto.password!, saltRounds);

    if (!existingEmployee) {
      if (file) fs.unlinkSync(file.path);
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    const updatePayload = {
      ...dto,
      password: hash,
    };

    if (file) {
      updatePayload.profileAvatar = file.filename;

      if (existingEmployee.profileAvatar) {
        const oldFilePath = path.join(
          './uploads/images',
          existingEmployee.profileAvatar,
        );

        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
    }

    return this.prisma.employee.update({
      where: { id },
      data: updatePayload,
    });
  }

  async remove(id: string): Promise<Employee> {
    return this.prisma.employee.delete({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<Employee | null> {
    return this.prisma.employee.findFirst({
      where: { email: email },
    });
  }
}

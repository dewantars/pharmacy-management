import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { DatabaseService } from '../../../common/database/database.service';
import {
  PaginatedResult,
  paginator,
} from '../../../common/helpers/pagination/pagination';
import {
  Prisma,
  Employee,
} from '../../../common/database/generated/prisma/client';
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
  constructor(private prisma: DatabaseService) { }

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

  async getEmployeeSeniority(
    id: string,
  ): Promise<{ years: number; months: number; message: string }> {
    const employee = await this.prisma.employee.findUnique({
      where: { id },
      select: { startDate: true, name: true },
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    if (!employee.startDate) {
      throw new NotFoundException(
        `Start date for employee ${employee.name} is not set`,
      );
    }

    const start = new Date(employee.startDate);
    const now = new Date();

    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();

    // adjust bulan
    if (months < 0) {
      years--;
      months += 12;
    }

    // adjust hari
    if (now.getDate() < start.getDate()) {
      months--;
      if (months < 0) {
        years--;
        months += 12;
      }
    }

    // safety biar gak negatif
    if (years < 0) years = 0;
    if (months < 0) months = 0;

    let messageParts: string[] = [];

    if (years > 0) messageParts.push(`${years} tahun`);
    if (months > 0) messageParts.push(`${months} bulan`);

    if (messageParts.length === 0) {
      messageParts.push('Kurang dari 1 bulan');
    }

    return {
      years,
      months,
      message: messageParts.join(' '),
    };
  }
}

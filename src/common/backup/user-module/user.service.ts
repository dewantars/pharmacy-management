import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { DatabaseService } from '../../common/database/database.service.js';
import {
  PaginatedResult,
  paginator,
} from '../../common/pagination/pagination.js';
import { Prisma, User } from '../../common/database/generated/prisma/client.js';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcrypt';

const paginate = paginator({ perPage: 10, page: 1 });

const saltRounds = 10;

type UserDataWithRelation = Prisma.UserGetPayload<{
  include: {
    medicineOrders: true;
    transactions: true;
  };
}>;

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);
  constructor(private prisma: DatabaseService) {}
  async create(dto: CreateUserDto, file: Express.Multer.File): Promise<User> {
    const hash = await bcrypt.hash(dto.password, saltRounds);

    if (file != null) {
      const userData = {
        ...dto,
        password: hash,
        provileAvatar: file.filename,
      };

      return await this.prisma.user.create({
        data: userData,
      });
    }
    const userData = {
      ...dto,
      password: hash,
    };

    return await this.prisma.user.create({
      data: userData,
    });
  }

  async findAll(page: number, perPage: number): Promise<PaginatedResult<User>> {
    return await paginate(
      this.prisma.user,
      { orderBy: { createdAt: 'desc' } },
      { page, perPage },
    );
  }

  async findOne(id: string): Promise<UserDataWithRelation> {
    const supplier = await this.prisma.user.findUnique({
      where: { id },
      include: {
        _count: true,
        medicineOrders: true,
        transactions: true,
      },
    });

    if (!supplier) {
      throw new NotFoundException(`user with ID ${id} not found`);
    }

    return supplier;
  }

  async update(
    id: string,
    dto: UpdateUserDto,
    file: Express.Multer.File,
  ): Promise<User> {
    const existingUser = await this.prisma.user.findUnique({
      where: { id: id },
    });
    const hash = await bcrypt.hash(dto.password!, saltRounds);

    if (!existingUser) {
      if (file) fs.unlinkSync(file.path);
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const updatePayload = {
      ...dto,
      password: hash,
    };

    if (file) {
      updatePayload.profileAvatar = file.filename;

      if (existingUser.profileAvatar) {
        const oldFilePath = path.join(
          './uploads/images',
          existingUser.profileAvatar,
        );

        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
    }

    return this.prisma.user.update({
      where: { id },
      data: updatePayload,
    });
  }

  async remove(id: string): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email: email },
    });
  }
}

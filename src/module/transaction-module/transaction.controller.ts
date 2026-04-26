import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { TransactionService } from './transaction.service.js';
import { CreateTransactionDto } from './dto/create-transaction.dto.js';
import { UpdateTransactionDto } from './dto/update-transaction.dto.js';
import { FilterTransactionDto } from './dto/filter-transaction.dto.js';
import { User } from '../../common/security/guards/user.decorator.js';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../common/security/guards/roles.decorator.js';

@Controller()
@Roles('OWNER')
@UseGuards(AuthGuard('jwt'))
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @Roles('CASHIER')
  create(
    @Body() createTransactionDto: CreateTransactionDto,
    @User('id') userId: string,
  ) {
    return this.transactionService.create(createTransactionDto, userId);
  }

  @Get()
  @Roles('CASHIER', 'ADMIN', 'OWNER')
  findAll(@Query('page') page?: number, @Query('perPage') perPage?: number) {
    return this.transactionService.findAll(perPage!, page!);
  }

  @Get('filter')
  @Roles('CASHIER', 'ADMIN', 'OWNER')
  findByFilter(
    @Query() filterDto: FilterTransactionDto,
    @Query('page') page?: number,
    @Query('perPage') perPage?: number,
  ) {
    return this.transactionService.findByFilter(filterDto, perPage!, page!);
  }

  // GET /transactions/report/monthly?month=5&year=2025
  @Get('report/monthly')
  @Roles('ADMIN', 'OWNER')
  async getMonthlyReport(
    @Query('month', new DefaultValuePipe(new Date().getMonth() + 1), ParseIntPipe)
    month: number,
    @Query('year', new DefaultValuePipe(new Date().getFullYear()), ParseIntPipe)
    year: number,
  ) {
    return this.transactionService.generateMonthlyReport(month, year);
  }

  @Get('report/supplier-orders')
  @Roles('ADMIN', 'OWNER', 'PHARMACIST')
  async getSupplierOrderSummary(@Query('supplierId') supplierId?: string) {
    return this.transactionService.getTotalOrderValuePerSupplier(supplierId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionService.findOne(id);
  }

  @Patch(':id')
  @Roles('CASHIER')
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionService.update(id, updateTransactionDto);
  }

  @Delete(':id')
  @Roles('CASHIER')
  remove(@Param('id') id: string) {
    return this.transactionService.remove(id);
  }
}
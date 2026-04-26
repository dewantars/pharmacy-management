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
} from '@nestjs/common';
import { SupplierService } from './supplier.service.js';
import { CreateSupplierDto } from './dto/create-supplier.dto.js';
import { UpdateSupplierDto } from './dto/update-supplier.dto.js';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../../common/security/guards/roles.decorator.js';

@Controller()
@UseGuards(AuthGuard('jwt'))
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post()
  @Roles('PHARMACIST', 'OWNER')
  create(@Body() createSupplierDto: CreateSupplierDto) {
    return this.supplierService.create(createSupplierDto);
  }

  @Get()
  @Roles('ADMIN', 'PHARMACIST', 'OWNER')
  findAll(@Query('page') page?: number, @Query('perPage') perPage?: number) {
    return this.supplierService.findAll(page!, perPage!);
  }

  // (3) DINA — menambahkan endpoint pencarian supplier berdasarkan nama
  @Get('search')
  @Roles('ADMIN', 'PHARMACIST', 'OWNER')
  searchByName(@Query('name') name: string) {
    return this.supplierService.searchByName(name);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.supplierService.findOne(id);
  }

  @Patch(':id')
  @Roles('PHARMACIST')
  update(
    @Param('id') id: string,
    @Body() updateSupplierDto: UpdateSupplierDto,
  ) {
    return this.supplierService.update(id, updateSupplierDto);
  }

  @Delete(':id')
  @Roles('PHARMACIST')
  remove(@Param('id') id: string) {
    return this.supplierService.remove(id);
  }
}

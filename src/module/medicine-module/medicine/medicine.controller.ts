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
import { MedicineService } from './medicine.service.js';
import { CreateMedicineDto } from './dto/create-medicine.dto.js';
import { UpdateMedicineDto } from './dto//update-medicine.dto.js';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../../common/security/guards/roles.decorator.js';

@Controller()
@UseGuards(AuthGuard('jwt'))
export class MedicineController {
  constructor(private readonly medicineService: MedicineService) {}

  @Post()
  @Roles('PHARMACIST')
  create(@Body() createMedicineDto: CreateMedicineDto) {
    return this.medicineService.create(createMedicineDto);
  }

  @Get()
  @Roles('PHARMACIST', 'ADMIN', 'OWNER')
  findAll(@Query('page') page?: number, @Query('perPage') perPage?: number) {
    return this.medicineService.findAll(page!, perPage!);
  }

  // (1) DHEA — menambahkan endpoint mendapatkan daftar obat dengan stok rendah
  @Get('low-stock')
  @Roles('PHARMACIST', 'ADMIN', 'OWNER')
  findLowStock(@Query('threshold') threshold?: string) {
    return this.medicineService.findLowStock(Number(threshold) || 10);
  }

  // (2) DHEA — menambahkan endpoint mendapatkan daftar obat berdasarkan kategori
  @Get('category')
  @Roles('PHARMACIST', 'ADMIN', 'OWNER')
  findByCategory(@Query('categoryId') categoryId: string) {
    return this.medicineService.findByCategory(categoryId);
  }

  // (3) DHEA — menambahkan endpoint mendapatkan daftar obat berdasarkan supplier
  @Get('supplier')
  @Roles('PHARMACIST', 'ADMIN', 'OWNER')
  findBySupplier(@Query('supplierId') supplierId: string) {
    return this.medicineService.findBySupplier(supplierId);
  }
  
  // (1) DINA — menambahkan endpoint pencarian obat berdasarkan nama
  @Get('search')
  @Roles('PHARMACIST', 'ADMIN', 'OWNER')
  searchByName(@Query('name') name: string) {
    return this.medicineService.searchByName(name);
  }

  // (2) DINA - menambahkan endpoint mendapatkan obat yang sudah kedaluwarsa
  @Get('expired')
  @Roles('PHARMACIST', 'ADMIN', 'OWNER')
  getExpiredMedicines() {
    return this.medicineService.getExpiredMedicines();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medicineService.findOne(id);
  }

  @Patch(':id')
  @Roles('PHARMACIST')
  update(
    @Param('id') id: string,
    @Body() updateMedicineDto: UpdateMedicineDto,
  ) {
    return this.medicineService.update(id, updateMedicineDto);
  }

  @Delete(':id')
  @Roles('PHARMACIST')
  remove(@Param('id') id: string) {
    return this.medicineService.remove(id);
  }
}
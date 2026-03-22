import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  // UseGuards,
} from '@nestjs/common';
import { MedicineService } from './medicine.service.js';
import { CreateMedicineDto } from './dto/create-medicine.dto.js';
import { UpdateMedicineDto } from './dto//update-medicine.dto.js';
// import { AuthGuard } from '@nestjs/passport';
// import { Roles } from '../../../common/security/guards/roles.decorator.js';

@Controller()
// @UseGuards(AuthGuard('jwt'))
export class MedicineController {
  constructor(private readonly medicineService: MedicineService) {}

  @Post()
  // @Roles('PHARMACIST')
  create(@Body() createMedicineDto: CreateMedicineDto) {
    return this.medicineService.create(createMedicineDto);
  }

  @Get()
  // @Roles('PHARMACIST', 'ADMIN', 'OWNER')
  findAll(@Query('page') page?: number, @Query('perPage') perPage?: number) {
    return this.medicineService.findAll(page!, perPage!);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medicineService.findOne(id);
  }

  @Patch(':id')
  // @Roles('PHARMACIST')
  update(
    @Param('id') id: string,
    @Body() updateMedicineDto: UpdateMedicineDto,
  ) {
    return this.medicineService.update(id, updateMedicineDto);
  }

  @Delete(':id')
  // @Roles('PHARMACIST')
  remove(@Param('id') id: string) {
    return this.medicineService.remove(id);
  }
}

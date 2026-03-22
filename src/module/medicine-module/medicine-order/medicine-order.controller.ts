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
import { MedicineOrderService } from './medicine-order.service.js';
import { CreateMedicineOrderDto } from './dto/create-medicine-order.dto.js';
import { UpdateMedicineOrderDto } from './dto/update-medicine-order.dto.js';
// import { AuthGuard } from '@nestjs/passport';
// import { User } from '../../../common/security/guards/user.decorator.js';
// import { Roles } from '../../../common/security/guards/roles.decorator.js';

@Controller()
// @Roles('PHARMACIST', 'ADMIN', 'OWNER')
// @UseGuards(AuthGuard('jwt'))
export class MedicineOrderController {
  constructor(private readonly medicineOrderService: MedicineOrderService) {}

  @Post()
  create(
    @Body() createMedicineOrderDto: CreateMedicineOrderDto,
    // @User('id') userId: string,
  ) {
    return this.medicineOrderService.create(createMedicineOrderDto);
  }

  @Get()
  findAll(@Query('page') page?: number, @Query('perPage') perPage?: number) {
    return this.medicineOrderService.findAll(page!, perPage!);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medicineOrderService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMedicineOrderDto: UpdateMedicineOrderDto,
  ) {
    return this.medicineOrderService.update(id, updateMedicineOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.medicineOrderService.remove(id);
  }
}

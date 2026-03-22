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
import { MedicineCategoryService } from './medicine-category.service.js';
import { CreateMedicineCategoryDto } from './dto/create-medicine-category.dto.js';
import { UpdateMedicineCategoryDto } from './dto/update-medicine-category.dto.js';
// import { AuthGuard } from '@nestjs/passport';
// import { Roles } from '../../../common/security/guards/roles.decorator.js';

@Controller()
// @UseGuards(AuthGuard('jwt'))
export class MedicineCategoryController {
  constructor(
    private readonly medicineCategoryService: MedicineCategoryService,
  ) {}

  @Post()
  // @Roles('PHARMACIST')
  create(@Body() createMedicineCategoryDto: CreateMedicineCategoryDto) {
    return this.medicineCategoryService.create(createMedicineCategoryDto);
  }

  @Get()
  // @Roles('PHARMACIST', 'ADMIN', 'OWNER')
  findAll(@Query('page') page?: number, @Query('perPage') perPage?: number) {
    return this.medicineCategoryService.findAll(page!, perPage!);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medicineCategoryService.findOne(id);
  }

  @Patch(':id')
  // @Roles('PHARMACIST')
  update(
    @Param('id') id: string,
    @Body() updateMedicineCategoryDto: UpdateMedicineCategoryDto,
  ) {
    return this.medicineCategoryService.update(id, updateMedicineCategoryDto);
  }

  @Delete(':id')
  // @Roles('PHARMACIST')
  remove(@Param('id') id: string) {
    return this.medicineCategoryService.remove(id);
  }
}

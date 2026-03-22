import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FinancialReportService } from './financial-report.service.js';
import { CreateFinancialReportDto } from './dto/create-financial-report.dto.js';
import { UpdateFinancialReportDto } from './dto/update-financial-report.dto.js';

@Controller('financial-report')
export class FinancialReportController {
  constructor(
    private readonly financialReportService: FinancialReportService,
  ) {}

  @Post()
  create(@Body() createFinancialReportDto: CreateFinancialReportDto) {
    return this.financialReportService.create(createFinancialReportDto);
  }

  @Get()
  findAll() {
    return this.financialReportService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.financialReportService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFinancialReportDto: UpdateFinancialReportDto,
  ) {
    return this.financialReportService.update(+id, updateFinancialReportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.financialReportService.remove(+id);
  }
}

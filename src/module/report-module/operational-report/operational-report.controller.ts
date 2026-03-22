import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OperationalReportService } from './operational-report.service.js';
import { CreateOperationalReportDto } from './dto/create-operational-report.dto.js';
import { UpdateOperationalReportDto } from './dto/update-operational-report.dto.js';

@Controller('operational-report')
export class OperationalReportController {
  constructor(
    private readonly operationalReportService: OperationalReportService,
  ) {}

  @Post()
  create(@Body() createOperationalReportDto: CreateOperationalReportDto) {
    return this.operationalReportService.create(createOperationalReportDto);
  }

  @Get()
  findAll() {
    return this.operationalReportService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.operationalReportService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOperationalReportDto: UpdateOperationalReportDto,
  ) {
    return this.operationalReportService.update(
      +id,
      updateOperationalReportDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.operationalReportService.remove(+id);
  }
}

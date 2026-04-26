import { Controller, Get, Res } from '@nestjs/common';
import { FinancialReportService } from './financial-report.service.js';
import { CreateFinancialReportDto } from './dto/create-financial-report.dto.js';
import { UpdateFinancialReportDto } from './dto/update-financial-report.dto.js';
import { Response } from 'express';

@Controller()
export class FinancialReportController {
  constructor(
    private readonly financialReportService: FinancialReportService,
  ) {}

@Get('summary')
  async getSummary() {
    return this.financialReportService.getFinancialData();
  }

  @Get('export/pdf')
  async exportPdf(@Res() res: Response) {
    return this.financialReportService.generatePdf(res);
  }

  @Get('export/csv')
  async exportCsv(@Res() res: Response) {
    const csv = await this.financialReportService.generateCsv();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=financial-report.csv');
    return res.status(200).send(csv);
  }
}

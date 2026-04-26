/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { FinancialReportController } from 'src/module/report-module/financial-report/financial-report.controller';
import { FinancialReportService } from 'src/module/report-module/financial-report/financial-report.service';
import { Response } from 'express';

describe('FinancialReportController', () => {
  let controller: FinancialReportController;
  let service: FinancialReportService;

  const mockService = {
    getFinancialData: jest.fn(),
    generatePdf: jest.fn(),
    generateCsv: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FinancialReportController],
      providers: [{ provide: FinancialReportService, useValue: mockService }],
    }).compile();

    controller = module.get<FinancialReportController>(
      FinancialReportController,
    );
    service = module.get<FinancialReportService>(FinancialReportService);
  });

  it('harus memanggil service getFinancialData pada endpoint summary', async () => {
    await controller.getSummary();
    expect(service.getFinancialData).toHaveBeenCalled();
  });

  it('harus mengatur header yang benar untuk ekspor CSV', async () => {
    const mockRes = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;

    mockService.generateCsv.mockResolvedValue('id,nama,nilai');

    await controller.exportCsv(mockRes);

    expect(mockRes.setHeader).toHaveBeenCalledWith('Content-Type', 'text/csv');
    expect(mockRes.status).toHaveBeenCalledWith(200);
  });
});

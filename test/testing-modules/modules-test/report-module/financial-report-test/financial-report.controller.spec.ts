import { Test, TestingModule } from '@nestjs/testing';
import { FinancialReportController } from 'src/module/report-module/financial-report/financial-report.controller';
import { FinancialReportService } from 'src/module/report-module/financial-report/financial-report.service';

describe('FinancialReportController', () => {
  let controller: FinancialReportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FinancialReportController],
      providers: [FinancialReportService],
    }).compile();

    controller = module.get<FinancialReportController>(FinancialReportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

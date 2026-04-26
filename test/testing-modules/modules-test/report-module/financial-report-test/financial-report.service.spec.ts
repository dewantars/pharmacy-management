import { Test, TestingModule } from '@nestjs/testing';
import { FinancialReportService } from 'src/module/report-module/financial-report/financial-report.service';

describe('FinancialReportService', () => {
  let service: FinancialReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FinancialReportService],
    }).compile();

    service = module.get<FinancialReportService>(FinancialReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

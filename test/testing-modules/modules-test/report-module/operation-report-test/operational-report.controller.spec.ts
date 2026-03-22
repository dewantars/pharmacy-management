import { Test, TestingModule } from '@nestjs/testing';
import { OperationalReportController } from './operational-report.controller.js';
import { OperationalReportService } from './operational-report.service.js';

describe('OperationalReportController', () => {
  let controller: OperationalReportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OperationalReportController],
      providers: [OperationalReportService],
    }).compile();

    controller = module.get<OperationalReportController>(OperationalReportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

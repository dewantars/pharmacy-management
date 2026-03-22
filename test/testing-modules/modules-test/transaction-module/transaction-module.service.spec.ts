import { Test, TestingModule } from '@nestjs/testing';
import { TransactionModuleService } from './transaction-module.service.js';

describe('TransactionModuleService', () => {
  let service: TransactionModuleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionModuleService],
    }).compile();

    service = module.get<TransactionModuleService>(TransactionModuleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

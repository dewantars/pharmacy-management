import { Test, TestingModule } from '@nestjs/testing';
import { TransactionModuleController } from './transaction-module.controller.js';
import { TransactionModuleService } from './transaction-module.service.js';

describe('TransactionModuleController', () => {
  let controller: TransactionModuleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionModuleController],
      providers: [TransactionModuleService],
    }).compile();

    controller = module.get<TransactionModuleController>(TransactionModuleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

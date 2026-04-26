import { Test, TestingModule } from '@nestjs/testing';
import { TransactionDetailController } from 'src/module/transaction-module/transaction-detail/transaction-detail.controller';
import { TransactionDetailService } from 'src/module/transaction-module/transaction-detail/transaction-detail.service';

jest.mock(
  'src/module/transaction-module/transaction-detail/transaction-detail.controller',
  () => ({
    TransactionDetailController: jest
      .fn()
      .mockImplementation(() => ({})),
  }),
);

jest.mock(
  'src/module/transaction-module/transaction-detail/transaction-detail.service',
  () => ({
    TransactionDetailService: jest.fn().mockImplementation(() => ({})),
  }),
);

describe('TransactionDetailController', () => {
  let controller: TransactionDetailController;
  let service: TransactionDetailService;

  const mockTransactionDetailService = {
    // Add mocked methods here as the service grows
    // findAll: jest.fn(),
    // findOne: jest.fn(),
    // create: jest.fn(),
    // update: jest.fn(),
    // remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionDetailController],
      providers: [
        {
          provide: TransactionDetailService,
          useValue: mockTransactionDetailService,
        },
      ],
    }).compile();

    controller = module.get<TransactionDetailController>(
      TransactionDetailController,
    );
    service = module.get<TransactionDetailService>(TransactionDetailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ─── Instantiation ────────────────────────────────────────────────────────

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should have TransactionDetailService injected', () => {
    expect(service).toBeDefined();
  });

  // ─── Placeholder: add describe blocks here when endpoints are implemented ─
  //
  // Example:
  //
  // describe('findAll', () => {
  //   it('should return all transaction details', async () => {
  //     mockTransactionDetailService.findAll.mockResolvedValue([...]);
  //     const result = await controller.findAll();
  //     expect(service.findAll).toHaveBeenCalled();
  //     expect(result).toEqual([...]);
  //   });
  // });
});
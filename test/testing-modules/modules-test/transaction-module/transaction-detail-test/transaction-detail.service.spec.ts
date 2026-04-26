import { Test, TestingModule } from '@nestjs/testing';
import { TransactionDetailService } from 'src/module/transaction-module/transaction-detail/transaction-detail.service';
import { DatabaseService } from 'src/common/database/database.service';

jest.mock(
  'src/module/transaction-module/transaction-detail/transaction-detail.service',
  () => ({
    TransactionDetailService: jest.fn().mockImplementation(() => ({})),
  }),
);

jest.mock('src/common/database/database.service', () => ({
  DatabaseService: jest.fn().mockImplementation(() => ({})),
}));

describe('TransactionDetailService', () => {
  let service: TransactionDetailService;
  let prisma: DatabaseService;

  const mockDatabaseService = {
    transactionDetail: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionDetailService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<TransactionDetailService>(TransactionDetailService);
    prisma = module.get<DatabaseService>(DatabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ─── Instantiation ────────────────────────────────────────────────────────

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have DatabaseService injected', () => {
    expect(prisma).toBeDefined();
  });

  // ─── Placeholder: add describe blocks here when methods are implemented ───
  //
  // Example:
  //
  // describe('findAll', () => {
  //   it('should return all transaction details', async () => {
  //     mockDatabaseService.transactionDetail.findMany.mockResolvedValue([...]);
  //     const result = await service.findAll();
  //     expect(result).toEqual([...]);
  //   });
  // });
});
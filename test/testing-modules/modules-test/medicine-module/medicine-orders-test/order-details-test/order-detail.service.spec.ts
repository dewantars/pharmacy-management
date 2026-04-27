import { Test, TestingModule } from '@nestjs/testing';
import { OrderDetailService } from 'src/module/medicine-module/medicine-order/order-detail/order-detail.service';
import { DatabaseService } from 'src/common/database/database.service';

describe('OrderDetailService', () => {
  let service: OrderDetailService;

  const mockDatabaseService = {
    orderDetail: {
      findMany: jest.fn(),
      deleteMany: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderDetailService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<OrderDetailService>(OrderDetailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

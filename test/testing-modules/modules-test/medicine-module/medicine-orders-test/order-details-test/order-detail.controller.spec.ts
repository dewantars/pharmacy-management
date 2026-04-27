import { Test, TestingModule } from '@nestjs/testing';
import { OrderDetailController } from 'src/module/medicine-module/medicine-order/order-detail/order-detail.controller';
import { OrderDetailService } from 'src/module/medicine-module/medicine-order/order-detail/order-detail.service';

describe('OrderDetailController', () => {
  let controller: OrderDetailController;

  const mockOrderDetailService = {
    findAll: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderDetailController],
      providers: [
        {
          provide: OrderDetailService,
          useValue: mockOrderDetailService,
        },
      ],
    }).compile();

    controller = module.get<OrderDetailController>(OrderDetailController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

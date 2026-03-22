import { Test, TestingModule } from '@nestjs/testing';
import { OrderDetailController } from '../order-detail.controller.js';
import { OrderDetailService } from '../order-detail.service.js';

describe('OrderDetailController', () => {
  let controller: OrderDetailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderDetailController],
      providers: [OrderDetailService],
    }).compile();

    controller = module.get<OrderDetailController>(OrderDetailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

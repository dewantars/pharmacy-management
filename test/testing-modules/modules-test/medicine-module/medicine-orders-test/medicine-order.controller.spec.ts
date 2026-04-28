import { Test, TestingModule } from '@nestjs/testing';
import { MedicineOrderController } from 'src/module/medicine-module/medicine-order/medicine-order.controller';
import { MedicineOrderService } from 'src/module/medicine-module/medicine-order/medicine-order.service';

describe('MedicineOrderController', () => {
  let controller: MedicineOrderController;

  const mockMedicineOrderService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicineOrderController],
      providers: [
        {
          provide: MedicineOrderService,
          useValue: mockMedicineOrderService,
        },
      ],
    }).compile();

    controller = module.get<MedicineOrderController>(MedicineOrderController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

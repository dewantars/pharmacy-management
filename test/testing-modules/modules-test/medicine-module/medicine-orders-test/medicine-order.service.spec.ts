import { Test, TestingModule } from '@nestjs/testing';
import { MedicineOrderService } from 'src/module/medicine-module/medicine-order/medicine-order.service';
import { DatabaseService } from 'src/common/database/database.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('MedicineOrderService', () => {
  let service: MedicineOrderService;

  const mockDatabaseService = {
    medicineOrder: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    medicine: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  const mockEventEmitter = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MedicineOrderService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter,
        },
      ],
    }).compile();

    service = module.get<MedicineOrderService>(MedicineOrderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

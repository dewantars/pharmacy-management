import { Test, TestingModule } from '@nestjs/testing';
import { MedicineCategoryService } from 'src/module/medicine-module/medicine-category/medicine-category.service';
import { DatabaseService } from 'src/common/database/database.service';

describe('MedicineCategoryService', () => {
  let service: MedicineCategoryService;

  const mockDatabaseService = {
    medicineCategory: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MedicineCategoryService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<MedicineCategoryService>(MedicineCategoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

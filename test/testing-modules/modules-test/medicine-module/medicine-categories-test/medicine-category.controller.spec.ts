import { Test, TestingModule } from '@nestjs/testing';
import { MedicineCategoryController } from 'src/module/medicine-module/medicine-category/medicine-category.controller';
import { MedicineCategoryService } from 'src/module/medicine-module/medicine-category/medicine-category.service';

describe('MedicineCategoryController', () => {
  let controller: MedicineCategoryController;

  const mockMedicineCategoryService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicineCategoryController],
      providers: [
        {
          provide: MedicineCategoryService,
          useValue: mockMedicineCategoryService,
        },
      ],
    }).compile();

    controller = module.get<MedicineCategoryController>(MedicineCategoryController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

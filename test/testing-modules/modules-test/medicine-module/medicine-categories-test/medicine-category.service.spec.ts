import { Test, TestingModule } from '@nestjs/testing';
import { MedicineCategoryService } from './medicine-category.service.js';

describe('MedicineCategoryService', () => {
  let service: MedicineCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MedicineCategoryService],
    }).compile();

    service = module.get<MedicineCategoryService>(MedicineCategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

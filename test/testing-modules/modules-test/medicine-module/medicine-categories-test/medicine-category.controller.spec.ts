import { Test, TestingModule } from '@nestjs/testing';
import { MedicineCategoryController } from 'src/module/medicine-module/medicine-category/medicine-category.controller';
import { MedicineCategoryService } from 'src/module/medicine-module/medicine-category/medicine-category.service';

describe('MedicineCategoryController', () => {
  let controller: MedicineCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicineCategoryController],
      providers: [MedicineCategoryService],
    }).compile();

    controller = module.get<MedicineCategoryController>(MedicineCategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { MedicineCategoryController } from '../medicine-category.controller.js';
import { MedicineCategoryService } from '../medicine-category.service.js';

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

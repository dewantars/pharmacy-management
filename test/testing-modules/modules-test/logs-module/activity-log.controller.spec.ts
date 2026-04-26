import { Test, TestingModule } from '@nestjs/testing';
import { ActivityLogController } from '../activity-log.controller.js'; 
import { ActivityLogService } from '../activity-log.service.js';
  let controller: ActivityLogController;

  const mockActivityLogService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivityLogController],
      providers: [
        {
          provide: ActivityLogService,
          useValue: mockActivityLogService,
        },
      ],
    }).compile();

    controller = module.get<ActivityLogController>(ActivityLogController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('TC-01 should call findAll default', async () => {
    await controller.findAll(1, 10);

    expect(mockActivityLogService.findAll).toHaveBeenCalledWith(
      1,
      10,
      undefined,
      undefined,
      'desc',
    );
  });

  it('TC-02 should filter by action', async () => {
    await controller.findAll(1, 10, 'DELETE');

    expect(mockActivityLogService.findAll).toHaveBeenCalledWith(
      1,
      10,
      'DELETE',
      undefined,
      'desc',
    );
  });

  it('TC-03 should find one', async () => {
    await controller.findOne('LOG01');

    expect(mockActivityLogService.findOne).toHaveBeenCalledWith('LOG01');
  });

  it('TC-04 should remove', async () => {
    await controller.remove('LOG01');

    expect(mockActivityLogService.remove).toHaveBeenCalledWith('LOG01');
  });
});
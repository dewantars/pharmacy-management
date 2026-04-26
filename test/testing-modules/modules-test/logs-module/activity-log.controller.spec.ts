import { Test, TestingModule } from '@nestjs/testing';
import { ActivityLogController } from '../../../../src/module/logs-module/activity-log.controller';
import { ActivityLogService } from '../../../../src/module/logs-module/activity-log.service';

describe('ActivityLogController', () => {
  let controller: ActivityLogController;
  let service: ActivityLogService;

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
    service = module.get<ActivityLogService>(ActivityLogService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('TC-01 should call findAll default', async () => {
    await controller.findAll(1, 10);

    expect(service.findAll).toHaveBeenCalledWith(
      1,
      10,
      undefined,
      undefined,
      'desc',
    );
  });

  it('TC-02 should filter by action', async () => {
    await controller.findAll(1, 10, 'DELETE');

    expect(service.findAll).toHaveBeenCalledWith(
      1,
      10,
      'DELETE',
      undefined,
      'desc',
    );
  });

  it('TC-03 should filter by employeeId', async () => {
    await controller.findAll(1, 10, undefined, 'EMP01');

    expect(service.findAll).toHaveBeenCalledWith(
      1,
      10,
      undefined,
      'EMP01',
      'desc',
    );
  });

  it('TC-04 should sort asc', async () => {
    await controller.findAll(1, 10, undefined, undefined, 'asc');

    expect(service.findAll).toHaveBeenCalledWith(
      1,
      10,
      undefined,
      undefined,
      'asc',
    );
  });

  it('TC-05 should findOne', async () => {
    await controller.findOne('LOG01');

    expect(service.findOne).toHaveBeenCalledWith('LOG01');
  });

  it('TC-06 should remove', async () => {
    await controller.remove('LOG01');

    expect(service.remove).toHaveBeenCalledWith('LOG01');
  });
});
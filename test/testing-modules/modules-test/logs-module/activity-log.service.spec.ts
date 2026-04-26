import { Test, TestingModule } from '@nestjs/testing';
import { ActivityLogService } from '../activity-log.service.js';
describe('ActivityLogService', () => {
  let service: ActivityLogService;

  const mockDatabaseService = {
    activityLog: {
      create: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivityLogService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<ActivityLogService>(ActivityLogService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('TC-01 should create log', async () => {
    const dto = {
      action: 'CREATE',
      employeeId: 'EMP01',
      resourceType: 'PRODUCT',
      resourceId: 'P01',
      payloadData: {},
    };

    mockDatabaseService.activityLog.create.mockResolvedValue(dto);

    const result = await service.create(dto);

    expect(result).toEqual(dto);
  });

  it('TC-02 should find one log', async () => {
    mockDatabaseService.activityLog.findUniqueOrThrow.mockResolvedValue({
      id: 'LOG01',
    });

    const result = await service.findOne('LOG01');

    expect(result).toEqual({ id: 'LOG01' });
  });

  it('TC-03 should remove log', async () => {
    mockDatabaseService.activityLog.delete.mockResolvedValue({
      id: 'LOG01',
    });

    const result = await service.remove('LOG01');

    expect(result).toEqual({ id: 'LOG01' });
  });
});
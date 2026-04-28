import { Test, TestingModule } from '@nestjs/testing';
import { ActivityTrackingInterceptor } from 'src/common/interceptors/activity-tracking.interceptor';
import { ActivityLogService } from 'src/module/logs-module/activity-log.service';

describe('ActivityTrackingInterceptor', () => {
  let interceptor: ActivityTrackingInterceptor;

  const mockActivityLogService = {
    create: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivityTrackingInterceptor,
        {
          provide: ActivityLogService,
          useValue: mockActivityLogService,
        },
      ],
    }).compile();

    interceptor = module.get<ActivityTrackingInterceptor>(ActivityTrackingInterceptor);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should intercept and add user ID to activity log if available', async () => {
    const mockExecutionContext: any = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { id: 'mock-user-id', email: 'test@example.com', role: 'USER' },
          method: 'POST',
          url: '/api/test',
          body: { key: 'value' },
          params: {},
        }),
        getResponse: () => ({}),
      }),
      getHandler: () => jest.fn(),
      getClass: () => Object,
    };

    const mockCallHandler: any = {
      handle: jest.fn().mockReturnValue({
        pipe: jest.fn().mockReturnValue(Promise.resolve({ data: 'response' })),
      }),
    };

    await interceptor.intercept(mockExecutionContext, mockCallHandler);

    expect(mockCallHandler.handle).toHaveBeenCalled();
  });

  it('should handle anonymous requests without user ID', async () => {
    const mockExecutionContext: any = {
      switchToHttp: () => ({
        getRequest: () => ({
          method: 'GET',
          url: '/api/public',
          body: {},
          params: {},
        }),
        getResponse: () => ({}),
      }),
      getHandler: () => jest.fn(),
      getClass: () => Object,
    };

    const mockCallHandler: any = {
      handle: jest.fn().mockReturnValue({
        pipe: jest.fn().mockReturnValue(Promise.resolve({ data: 'public response' })),
      }),
    };

    await interceptor.intercept(mockExecutionContext, mockCallHandler);

    expect(mockCallHandler.handle).toHaveBeenCalled();
  });
});

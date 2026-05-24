import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { ActivityTrackingInterceptor } from 'src/common/interceptors/activity-tracking.interceptor';
import { ActivityLogService } from 'src/module/logs-module/activity-log.service';
import { of } from 'rxjs';

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

  const createMockContext = (
    method: string,
    url: string,
    user: any = null,
    body: any = {},
    params: any = {},
  ): ExecutionContext => {
    const mockRequest = {
      method,
      url,
      user,
      body,
      params,
    };

    return {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as unknown as ExecutionContext;
  };

  describe('Mutating requests with authenticated user', () => {
    it('should intercept POST requests', (done) => {
      const context = createMockContext(
        'POST',
        '/api/medicines',
        { id: 'user-1' },
        { name: 'Medicine' },
        {},
      );

      const mockCallHandler: CallHandler = {
        handle: () => of({ id: 1 }),
      };

      // Wait a bit for async operations
      setTimeout(() => {
        interceptor.intercept(context, mockCallHandler).subscribe(() => {
          expect(mockActivityLogService.create).toHaveBeenCalled();
          done();
        });
      }, 100);
    });

    it('should intercept PATCH requests', (done) => {
      const context = createMockContext(
        'PATCH',
        '/api/medicines/1',
        { id: 'user-1' },
        { name: 'Updated' },
        { id: '1' },
      );

      const mockCallHandler: CallHandler = {
        handle: () => of({ id: 1 }),
      };

      setTimeout(() => {
        interceptor.intercept(context, mockCallHandler).subscribe(() => {
          expect(mockActivityLogService.create).toHaveBeenCalled();
          done();
        });
      }, 100);
    });

    it('should intercept PUT requests', (done) => {
      const context = createMockContext(
        'PUT',
        '/api/employees/1',
        { id: 'user-1' },
        { name: 'John' },
        { id: '1' },
      );

      const mockCallHandler: CallHandler = {
        handle: () => of({ id: 1 }),
      };

      setTimeout(() => {
        interceptor.intercept(context, mockCallHandler).subscribe(() => {
          expect(mockActivityLogService.create).toHaveBeenCalled();
          done();
        });
      }, 100);
    });

    it('should intercept DELETE requests', (done) => {
      const context = createMockContext(
        'DELETE',
        '/api/medicines/1',
        { id: 'user-1' },
        {},
        { id: '1' },
      );

      const mockCallHandler: CallHandler = {
        handle: () => of({ success: true }),
      };

      setTimeout(() => {
        interceptor.intercept(context, mockCallHandler).subscribe(() => {
          expect(mockActivityLogService.create).toHaveBeenCalled();
          done();
        });
      }, 100);
    });
  });

  describe('Non-mutating requests', () => {
    it('should not log GET requests', (done) => {
      mockActivityLogService.create.mockClear();

      const context = createMockContext(
        'GET',
        '/api/medicines',
        { id: 'user-1' },
        {},
        {},
      );

      const mockCallHandler: CallHandler = {
        handle: () => of([{ id: 1 }]),
      };

      setTimeout(() => {
        interceptor.intercept(context, mockCallHandler).subscribe(() => {
          expect(mockActivityLogService.create).not.toHaveBeenCalled();
          done();
        });
      }, 100);
    });
  });

  describe('Unauthenticated requests', () => {
    it('should not log mutating requests without user', (done) => {
      mockActivityLogService.create.mockClear();

      const context = createMockContext(
        'POST',
        '/api/medicines',
        null,
        { name: 'Medicine' },
        {},
      );

      const mockCallHandler: CallHandler = {
        handle: () => of({ id: 1 }),
      };

      setTimeout(() => {
        interceptor.intercept(context, mockCallHandler).subscribe(() => {
          expect(mockActivityLogService.create).not.toHaveBeenCalled();
          done();
        });
      }, 100);
    });
  });

  describe('Request handling', () => {
    it('should pass through the request to the next handler', (done) => {
      const context = createMockContext(
        'GET',
        '/api/test',
        null,
        {},
        {},
      );

      const mockCallHandler: CallHandler = {
        handle: jest.fn().mockReturnValue(of({ data: 'response' })),
      };

      interceptor.intercept(context, mockCallHandler).subscribe(() => {
        expect(mockCallHandler.handle).toHaveBeenCalled();
        done();
      });
    });
  });
});

import { ResponseInterceptors } from 'src/common/interceptors/response-interceptors.interceptor';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';

describe('ResponseInterceptorsInterceptor', () => {
  let interceptor: ResponseInterceptors;

  beforeEach(() => {
    interceptor = new ResponseInterceptors();
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  const createMockContext = (method: string, statusCode: number = 200) => {
    const mockRequest = { method };
    const mockResponse = { statusCode };

    const mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest),
        getResponse: jest.fn().mockReturnValue(mockResponse),
      }),
    } as unknown as ExecutionContext;

    return mockContext;
  };

  describe('POST request', () => {
    it('should return success message for POST', (done) => {
      const context = createMockContext('POST', 201);
      const mockCallHandler: CallHandler = {
        handle: () => of({ data: { id: 1, name: 'test' } }),
      };

      interceptor.intercept(context, mockCallHandler).subscribe((result: any) => {
        expect(result.message).toBe('Post Operation successfully.');
        expect(result.status).toBe(201);
        expect(result.data).toEqual({ id: 1, name: 'test' });
        expect(result.meta).toBe(null);
        done();
      });
    });

    it('should use custom message for POST if provided', (done) => {
      const context = createMockContext('POST', 201);
      const mockCallHandler: CallHandler = {
        handle: () =>
          of({
            message: 'Custom POST message',
            data: { id: 1 },
          }),
      };

      interceptor.intercept(context, mockCallHandler).subscribe((result: any) => {
        expect(result.message).toBe('Custom POST message');
        done();
      });
    });
  });

  describe('GET request', () => {
    it('should return success message for GET', (done) => {
      const context = createMockContext('GET', 200);
      const mockCallHandler: CallHandler = {
        handle: () => of({ data: [{ id: 1 }, { id: 2 }] }),
      };

      interceptor.intercept(context, mockCallHandler).subscribe((result: any) => {
        expect(result.message).toBe('Data retrieved successfully.');
        expect(result.status).toBe(200);
        expect(result.data).toEqual([{ id: 1 }, { id: 2 }]);
        done();
      });
    });

    it('should use custom message for GET if provided', (done) => {
      const context = createMockContext('GET', 200);
      const mockCallHandler: CallHandler = {
        handle: () =>
          of({
            message: 'Custom GET message',
            data: { id: 1 },
          }),
      };

      interceptor.intercept(context, mockCallHandler).subscribe((result: any) => {
        expect(result.message).toBe('Custom GET message');
        done();
      });
    });
  });

  describe('PUT request', () => {
    it('should return success message for PUT', (done) => {
      const context = createMockContext('PUT', 200);
      const mockCallHandler: CallHandler = {
        handle: () => of({ data: { id: 1, name: 'updated' } }),
      };

      interceptor.intercept(context, mockCallHandler).subscribe((result: any) => {
        expect(result.message).toBe('Data updated successfully.');
        expect(result.data).toEqual({ id: 1, name: 'updated' });
        done();
      });
    });
  });

  describe('PATCH request', () => {
    it('should return success message for PATCH', (done) => {
      const context = createMockContext('PATCH', 200);
      const mockCallHandler: CallHandler = {
        handle: () => of({ data: { id: 1, field: 'patched' } }),
      };

      interceptor.intercept(context, mockCallHandler).subscribe((result: any) => {
        expect(result.message).toBe('Data updated successfully.');
        done();
      });
    });
  });

  describe('DELETE request', () => {
    it('should return success message for DELETE', (done) => {
      const context = createMockContext('DELETE', 200);
      const mockCallHandler: CallHandler = {
        handle: () => of(null),
      };

      interceptor.intercept(context, mockCallHandler).subscribe((result: any) => {
        expect(result.message).toBe('Data was successfully deleted.');
        expect(result.data).toBeNull();
        done();
      });
    });

    it('should handle DELETE with 204 status', (done) => {
      const context = createMockContext('DELETE', 204);
      const mockCallHandler: CallHandler = {
        handle: () => of(null),
      };

      interceptor.intercept(context, mockCallHandler).subscribe((result: any) => {
        expect(result.message).toBe('Data was successfully deleted.');
        expect(result.status).toBe(204);
        done();
      });
    });
  });

  describe('Unknown HTTP method', () => {
    it('should return default message for unknown method', (done) => {
      const context = createMockContext('UNKNOWN', 200);
      const mockCallHandler: CallHandler = {
        handle: () => of({ data: { test: 'data' } }),
      };

      interceptor.intercept(context, mockCallHandler).subscribe((result: any) => {
        expect(result.message).toBe('The operation was successful.');
        done();
      });
    });
  });

  describe('Meta data handling', () => {
    it('should include meta when provided', (done) => {
      const context = createMockContext('GET', 200);
      const mockCallHandler: CallHandler = {
        handle: () =>
          of({
            data: { items: [] },
            meta: { total: 0, page: 1 },
          }),
      };

      interceptor.intercept(context, mockCallHandler).subscribe((result: any) => {
        expect(result.meta).toEqual({ total: 0, page: 1 });
        done();
      });
    });

    it('should set meta to null when not provided', (done) => {
      const context = createMockContext('GET', 200);
      const mockCallHandler: CallHandler = {
        handle: () => of({ data: [1, 2, 3] }),
      };

      interceptor.intercept(context, mockCallHandler).subscribe((result: any) => {
        expect(result.meta).toBeNull();
        done();
      });
    });
  });

  describe('Data transformation', () => {
    it('should use data property when available', (done) => {
      const context = createMockContext('GET', 200);
      const mockCallHandler: CallHandler = {
        handle: () =>
          of({
            message: 'Success',
            data: { id: 1, name: 'test' },
          }),
      };

      interceptor.intercept(context, mockCallHandler).subscribe((result: any) => {
        expect(result.data).toEqual({ id: 1, name: 'test' });
        done();
      });
    });

    it('should use entire response object as data when data property not available', (done) => {
      const context = createMockContext('GET', 200);
      const mockCallHandler: CallHandler = {
        handle: () => of({ id: 1, name: 'test' }),
      };

      interceptor.intercept(context, mockCallHandler).subscribe((result: any) => {
        expect(result.data).toEqual({ id: 1, name: 'test' });
        done();
      });
    });
  });
});

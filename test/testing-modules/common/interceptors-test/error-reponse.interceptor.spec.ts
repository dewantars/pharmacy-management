import { ErrorReponseInterceptor } from 'src/common/interceptors/error-reponse.interceptor';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of, throwError } from 'rxjs';

describe('ErrorReponseInterceptor', () => {
  let interceptor: ErrorReponseInterceptor;

  beforeEach(() => {
    interceptor = new ErrorReponseInterceptor();
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should pass through the call handler', () => {
    const mockContext = {} as ExecutionContext;
    const mockHandler: CallHandler = {
      handle: jest.fn().mockReturnValue(of({ data: 'test' })),
    };

    interceptor.intercept(mockContext, mockHandler);

    expect(mockHandler.handle).toHaveBeenCalled();
  });

  it('should return the result from next.handle()', (done) => {
    const mockContext = {} as ExecutionContext;
    const expectedData = { data: 'test result' };
    const mockHandler: CallHandler = {
      handle: jest.fn().mockReturnValue(of(expectedData)),
    };

    interceptor.intercept(mockContext, mockHandler).subscribe((result: any) => {
      expect(result).toEqual(expectedData);
      done();
    });
  });

  it('should handle errors passed through', (done) => {
    const mockContext = {} as ExecutionContext;
    const testError = new Error('Test error');
    const mockHandler: CallHandler = {
      handle: jest.fn().mockReturnValue(throwError(() => testError)),
    };

    interceptor.intercept(mockContext, mockHandler).subscribe({
      next: () => fail('should have thrown'),
      error: (error: any) => {
        expect(error).toBe(testError);
        done();
      },
    });
  });
});

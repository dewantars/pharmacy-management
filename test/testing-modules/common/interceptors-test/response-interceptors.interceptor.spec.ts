import { ResponseInterceptors } from 'src/common/interceptors/response-interceptors.interceptor';

describe('ResponseInterceptorsInterceptor', () => {
  it('should be defined', () => {
    expect(new ResponseInterceptors()).toBeDefined();
  });
});

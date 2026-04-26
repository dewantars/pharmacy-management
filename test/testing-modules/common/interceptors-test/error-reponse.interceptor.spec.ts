import { ErrorReponseInterceptor } from 'src/common/interceptors/error-reponse.interceptor';

describe('ErrorReponseInterceptor', () => {
  it('should be defined', () => {
    expect(new ErrorReponseInterceptor()).toBeDefined();
  });
});

import { ActivityTrackingInterceptor } from '../activity-tracking.interceptor.js';

describe('ActivityTrackingInterceptor', () => {
  it('should be defined', () => {
    expect(new ActivityTrackingInterceptor()).toBeDefined();
  });
});

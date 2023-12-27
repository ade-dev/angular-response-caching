import { TestBed } from '@angular/core/testing';
import { CacheTimerService } from './cache-timer.service';

describe('CacheTimerService', () => {
  let cacheTimerService: CacheTimerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    cacheTimerService = TestBed.inject(CacheTimerService);
  });

  it('should be created', () => {
    expect(cacheTimerService).toBeTruthy();
  });

  it('should return timestamp', () => {
    const timestamp = cacheTimerService.setTimestamp();
    expect(timestamp).toBeDefined();
  });
  it('should check expiry', () => {
    const timestamp = new Date();
    const isExpired = cacheTimerService.isExpired(timestamp);
    expect(isExpired).toBeFalse();
  });
});

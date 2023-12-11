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

  it('should create countdown of 30 minutes', () => {
    cacheTimerService.startTimer();
    const countDown = cacheTimerService.getCountDown();

    expect(countDown).toBeDefined();
  });
});

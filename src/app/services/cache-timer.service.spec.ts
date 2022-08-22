import { TestBed } from '@angular/core/testing';

import { CacheTimerService } from './cache-timer.service';

describe('CacheTimerService', () => {
  let service: CacheTimerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CacheTimerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';
import { CacheService } from './cache.service';
import { HttpResponse } from '@angular/common/http';
interface TestData {
  name: string;
}

const testUrl = '/data';

describe('CacheService', () => {
  let cacheService: CacheService;
  const testData: TestData = { name: 'Test Data' };

  const testResponse = new HttpResponse({
    status: 200,
    statusText: 'OK',
    body: testData,
  });

  beforeEach(() => {
    TestBed.configureTestingModule({});
    cacheService = TestBed.inject(CacheService);

    cacheService.addResponse(testUrl, testResponse);
  });

  it('should be created', () => {
    expect(cacheService).toBeTruthy();
  });

  it(`should have added response to 'cachedResponses' object`, () => {
    expect(cacheService.cachedResponses.size).toBe(1);
  });

  it(`should clear 'cachedResponses' object`, () => {
    cacheService.clearCache();
    expect(cacheService.cachedResponses.size).toBe(0);
  });

  it(`should check for response in 'cachedResponses' object`, () => {
    cacheService.checkResponse(testUrl);
    expect(cacheService.cachedResponses.has(testUrl)).toBe(true);
  });
});

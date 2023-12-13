import { TestBed } from '@angular/core/testing';
import { CacheStoreService } from './cache-store.service';
import { HttpResponse } from '@angular/common/http';
interface TestData {
  name: string;
}

const testUrl = '/data';

describe('Cached object service', () => {
  let cachedObjectService: CacheStoreService;
  const testData: TestData = { name: 'Test Data' };

  const testResponse = new HttpResponse({
    status: 200,
    statusText: 'OK',
    body: testData,
  });

  beforeEach(() => {
    TestBed.configureTestingModule({});
    cachedObjectService = TestBed.inject(CacheStoreService);

    cachedObjectService.addResponse(testUrl, testResponse);
  });

  it('should be created', () => {
    expect(cachedObjectService).toBeTruthy();
  });

  it(`should have added response to 'cachedResponses' object`, () => {
    expect(cachedObjectService.cachedResponses.size).toBe(1);
  });

  it(`should clear 'cachedResponses' object`, () => {
    cachedObjectService.clearCache();
    expect(cachedObjectService.cachedResponses.size).toBe(0);
  });

  it(`should check for response in 'cachedResponses' object`, () => {
    cachedObjectService.checkResponse(testUrl);
    expect(cachedObjectService.cachedResponses.has(testUrl)).toBe(true);
  });
});

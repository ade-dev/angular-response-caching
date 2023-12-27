import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CacheStoreService {

  cachedResponses = new Map<string, [HttpResponse<unknown>, Date]>();

  getResponse(requestUrl: string): [HttpResponse<unknown>, Date] | undefined {
    return this.cachedResponses.get(requestUrl);
  }

  addResponse(requestUrl: string, response: HttpResponse<unknown>, timestamp: Date): void {
    this.cachedResponses.set(requestUrl, [response, timestamp]);
  }

  clearResponse(requestUrl: string): void {
    this.cachedResponses.delete(requestUrl);
  }
}

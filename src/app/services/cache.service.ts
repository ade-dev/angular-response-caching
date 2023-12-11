import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  public cachedResponses = new Map<string, HttpResponse<unknown>>();

  checkResponse(requestUrl: string): HttpResponse<unknown> | undefined {
    return this.cachedResponses.get(requestUrl);
  }

  addResponse(url: string, response: HttpResponse<unknown>): void {
    this.cachedResponses.set(url, response);
  }

  clearCache(): void {
    this.cachedResponses.clear();
  }
}

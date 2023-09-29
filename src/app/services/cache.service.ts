import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  private cacheResponses = new Map<string, HttpResponse<unknown>>();

  getResponse(requestUrl: string): HttpResponse<unknown> | undefined {
    return this.cacheResponses.get(requestUrl);
  }

  addResponse(url: string, response: HttpResponse<unknown>): void {
    this.cacheResponses.set(url, response);
  }

  clearCache(): void {
    this.cacheResponses.clear();
  }
}

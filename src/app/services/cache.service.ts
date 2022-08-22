import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  constructor() { }

  private cachedResponses: any = {};

  getResponse(url: string): HttpResponse<any> | undefined {
    return this.cachedResponses[url];
  }

  addResponse(url: string, response: HttpResponse<any>): void {
    this.cachedResponses[url] = response;
  }

  clearCache(): void {
    this.cachedResponses = {};
  }
}

import { Injectable } from '@angular/core';
import { CacheService } from './cache.service';
import { CacheTimerService } from '../services/cache-timer.service';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CacheInterceptorService implements HttpInterceptor {

  constructor(
    private cacheService: CacheService,
    private cacheTimerService: CacheTimerService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    this.cacheTimerService.startTimer();
    const countDown = this.cacheTimerService.getCountDown();

    if (countDown <= 0) {
      this.cacheTimerService.resetTimer();
      this.cacheService.clearCache();
    }

    if (request.method === 'GET') {
      const cachedResponse: HttpResponse<any> | undefined = this.cacheService.getResponse(request.url);

      if (cachedResponse) {
        return of(cachedResponse);
      }

      return next.handle(request).pipe(
        tap((event: any) => {
          if (event instanceof HttpResponse) {
            this.cacheService.addResponse(request.url, event);
          }
        })
      );
    }
    else {
      return next.handle(request);
    }
  }
}

import { Injectable } from '@angular/core';
import { CacheService } from './cache.service';
import { CacheTimerService } from './cache-timer.service';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {

  constructor(
    public cacheService: CacheService,
    private cacheTimerService: CacheTimerService
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    this.cacheTimerService.startTimer();
    const countDown = this.cacheTimerService.getCountDown();

    if (countDown <= 0) {
      this.cacheTimerService.resetTimer();
      this.cacheService.clearCache();
    }

    if (request.method === 'GET') {
      const cachedResponse = this.cacheService.checkResponse(request.url);

      if (cachedResponse) {
        return of(cachedResponse);
      }

      return next.handle(request).pipe(
        tap(event => {
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

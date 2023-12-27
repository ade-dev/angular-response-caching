import { HttpRequest, HttpHandlerFn, HttpEvent, HttpResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { Observable, of, tap } from "rxjs";
import { CacheStoreService } from "./cache-store.service";
import { CacheTimerService } from "./cache-timer.service";

export function cachingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn):
    Observable<HttpEvent<unknown>> {

    const cacheStoreService = inject(CacheStoreService);
    const cacheTimerService = inject(CacheTimerService);

    if (req.method === 'GET') {
        const cachedResponse = cacheStoreService.getResponse(req.url);

        if (cachedResponse) {
            if (!cacheTimerService.isExpired(cachedResponse[1])) {
                return of(cachedResponse[0]);
            }
            else {
                cacheStoreService.clearResponse(req.url);
            }
        }

        return next(req).pipe(
            tap(event => {
                if (event instanceof HttpResponse) {
                    cacheStoreService.addResponse(req.url, event, cacheTimerService.setTimestamp());
                }
            })
        );
    }
    else {
        return next(req);
    }
}
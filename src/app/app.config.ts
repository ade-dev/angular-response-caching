import { ApplicationConfig } from '@angular/core';
import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { CacheInterceptorService } from './services/cache-interceptor.service';

import { provideRouter } from '@angular/router';

export const appConfig: ApplicationConfig = {

    providers: [
        provideRouter(routes),
        provideHttpClient(withFetch(), withInterceptorsFromDi()),
        provideAnimations(),
        {
            provide: HTTP_INTERCEPTORS,
            useClass: CacheInterceptorService,
            multi: true
        }
    ]
};
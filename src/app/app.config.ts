import { ApplicationConfig } from '@angular/core';
import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { cachingInterceptor } from './services/caching-interceptor-fn';

export const appConfig: ApplicationConfig = {

    providers: [
        provideRouter(routes),
        provideHttpClient(
            withFetch(),
            withInterceptors([
                cachingInterceptor
            ])
        ),
        provideAnimations()
    ]
};
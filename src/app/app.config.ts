import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from 'auth';
import {
  CATALOG_PAGE_LIMIT,
  CATALOG_PAGE_OFFSET,
} from '@app/catalog/application/catalog.tokens';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([authInterceptor])),
    { provide: CATALOG_PAGE_LIMIT, useValue: 15 },
    { provide: CATALOG_PAGE_OFFSET, useValue: 0 },
  ]
};

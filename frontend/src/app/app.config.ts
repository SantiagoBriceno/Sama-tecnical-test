import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { ROOT_REDUCERS } from './app.state';
import { AuthEffect } from './core/auth/effects/auth.effect';
import { RecipeEffect } from './core/recipes/effects/recipe.effect';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpInterceptor } from './core/interceptor/http.interceptor';
import { CollabEffect } from './core/collab/effects/collab.effect';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideStore(ROOT_REDUCERS),
    provideEffects([AuthEffect, RecipeEffect, CollabEffect]),
    provideHttpClient(
      withInterceptorsFromDi()
    ),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptor,
      multi: true,
    }
]
};

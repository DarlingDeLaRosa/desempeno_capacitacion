import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { ClassImports } from './helpers/class.components';
import { HttpClientModule } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    // provideRouter(routes), 
    provideRouter(routes, withHashLocation()),
    provideAnimations(),
    importProvidersFrom(
      HttpClientModule
    )
  ]
};

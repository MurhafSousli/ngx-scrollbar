import { APP_ID, ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: APP_ID,  useValue: 'serverApp' },
    provideAnimations()
  ]
};

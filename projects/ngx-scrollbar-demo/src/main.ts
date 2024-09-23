import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

window.addEventListener('error', function (e) {
  console.error('🍄 ResizeObserver Error occurred: ', e);
});

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

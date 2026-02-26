import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';

// Override config with HttpClient
const configWithHttp = {
  ...appConfig,
  providers: [...(appConfig.providers || []), provideHttpClient()],
};

bootstrapApplication(AppComponent, configWithHttp).catch((err) =>
  console.error(err),
);

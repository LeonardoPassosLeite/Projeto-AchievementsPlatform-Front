import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/core/app.config';
import { DashboardComponent } from './app/pages/dashboard/dashboard.component';

bootstrapApplication(DashboardComponent, appConfig)
  .catch((err) => console.error(err));

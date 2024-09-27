import { bootstrapApplication } from '@angular/platform-browser';
import { config } from './app/core/app.config.server';
import { DashboardComponent } from './app/pages/dashboard/dashboard.component';

const bootstrap = () => bootstrapApplication(DashboardComponent, config);

export default bootstrap;

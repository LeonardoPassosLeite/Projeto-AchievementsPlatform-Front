import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouterOutlet } from '@angular/router';
import { provideHttpClient, HTTP_INTERCEPTORS, withFetch } from '@angular/common/http';
import { AuthInterceptor } from './app/shared/services/commons/auth-interceptor';
import { routes } from './app/core/app.routes';
import { Component, importProvidersFrom } from '@angular/core';
import { AccountGameQuery } from './app/state/account-game/AccountGame.query';
import { AccountGameStore } from './app/state/account-game/AccountGame.store';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgChartsModule } from 'ng2-charts';


@Component({
  selector: 'app-root',
  standalone: true,
  template: '<router-outlet></router-outlet>',
  imports: [RouterOutlet],
})
export class RootComponent { }

bootstrapApplication(RootComponent, {
  providers: [
    provideHttpClient(withFetch()),
    provideRouter(routes),
    AccountGameStore,
    AccountGameQuery,
    importProvidersFrom(BrowserAnimationsModule, NgChartsModule),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
}).catch((err) => console.error(err));
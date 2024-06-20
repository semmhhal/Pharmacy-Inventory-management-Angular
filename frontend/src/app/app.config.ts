import {
  APP_INITIALIZER,
  ApplicationConfig,
  inject,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { provideToastr } from 'ngx-toastr';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { usersInterceptor } from './users/users.interceptor';
import { UserService } from './users/user.service';

function bootstrap() {
  const userService = inject(UserService);
  return () => {
    const presistedState = localStorage.getItem('finalProject');
    if (presistedState) {
      userService.$state.set(JSON.parse(presistedState));
    }
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([usersInterceptor])),
    provideToastr(),
    { provide: APP_INITIALIZER, multi: true, useFactory: bootstrap },
  ],
};

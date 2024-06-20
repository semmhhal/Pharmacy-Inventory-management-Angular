import { Router, Routes } from '@angular/router';
import { SigninComponent } from './signin.component';
import { SignupComponent } from './signup.component';
import { inject } from '@angular/core';
import { UserService } from './user.service';

export const userRoutes: Routes = [
  {
    path: 'signin',
    component: SigninComponent,
    canActivate: [() => !inject(UserService).isLoggedin()],
  },
  {
    path: 'signup',
    component: SignupComponent,
    canActivate: [() => !inject(UserService).isLoggedin()],
  },
];

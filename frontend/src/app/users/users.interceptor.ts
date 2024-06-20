import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserService } from './user.service';

export const usersInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(UserService);
  if (auth.isLoggedin()) {
    const reqwithToken = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${auth.$state().jwt}`),
    });
    return next(reqwithToken);
  } else {
    return next(req);
  }
};

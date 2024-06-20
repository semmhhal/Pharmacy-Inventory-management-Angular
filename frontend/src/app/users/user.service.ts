import { Injectable, effect, inject, signal } from '@angular/core';
import { State, User, initialState } from './user.types';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  $state = signal<State>(initialState);
  readonly #http = inject(HttpClient);

  constructor() {
    effect(() => {
      localStorage.setItem('finalProject', JSON.stringify(this.$state()));
    });
  }
  signup(user: User) {
    return this.#http.post<{ success: boolean; data: User }>(
      environment.BACKEND_SERVER_URL + '/users/signup',
      user
    );
  }

  signin(credentials: { email: string; password: string }) {
    return this.#http.post<{ success: boolean; data: string }>(
      environment.BACKEND_SERVER_URL + '/users/signin',
      credentials
    );
  }

  isLoggedin() {
    return this.$state()._id ? true : false;
  }
}

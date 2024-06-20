import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { NgClass, NgStyle } from '@angular/common';
import { UserService } from './users/user.service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatButtonToggleModule,
    NgClass,
    MatButtonModule,
    RouterLink,
    NgStyle,
    MatIcon,
  ],
  template: `
    @if(!userService.isLoggedin()){
    <div>
      <span class="example-button-row">
        <button mat-flat-button [routerLink]="['users', 'signin']">
          Sign In
        </button>
        <button mat-flat-button [routerLink]="['users', 'signup']">
          Sign Up
        </button>
      </span>
    </div>
    }

    <router-outlet />
  `,
  styleUrl: `style.css`,
})
export class AppComponent {
  readonly #router = inject(Router);
  readonly userService = inject(UserService);

  locatetoHome() {
    this.#router.navigate(['', 'medications']);
  }
}

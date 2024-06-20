import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from './user.service';
import { Router } from '@angular/router';
import { User } from './user.types';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    NgStyle,
    MatFormFieldModule,
    MatButtonModule,
  ],
  template: `
    <div [ngStyle]="{ 'padding-top': '100px' }">
      <form [formGroup]="form" (ngSubmit)="signUp()">
        <div align="center">
          <mat-form-field>
            <mat-label class="all-font">Full name</mat-label>
            <input
              matInput
              placeholder="Enter your name"
              formControlName="fullname"
              required
            />
          </mat-form-field>
          <div>
            <mat-form-field>
              <mat-label class="all-font">Enter your Email</mat-label>
              <input
                matInput
                placeholder="pat@example.com"
                formControlName="email"
                required
              />
            </mat-form-field>
          </div>

          <div>
            <mat-form-field>
              <mat-label class="all-font">Enter your Password</mat-label>
              <input
                matInput
                type="password"
                formControlName="password"
                required
              />
            </mat-form-field>
          </div>
          <button
            mat-flat-button
            type="submit"
            [disabled]="form.invalid"
            class="all-font"
          >
            Sign up
          </button>
        </div>
      </form>
    </div>
  `,
  styleUrl: `../style.css`,
})
export class SignupComponent {
  readonly #userAuth = inject(UserService);
  readonly #router = inject(Router);
  readonly #notification = inject(ToastrService);

  form = inject(FormBuilder).group({
    fullname: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  signUp() {
    this.#userAuth.signup(this.form.value as User).subscribe((response) => {
      if (response.success) {
        this.#notification.success('successfully Signed in.');
        this.#router.navigate(['users', 'signin']);
      }
    });
  }
}

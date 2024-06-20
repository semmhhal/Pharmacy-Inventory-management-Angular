import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';
import { MedicationService } from '../medications/medication.service';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { State, User } from './user.types';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { NgClass, NgStyle } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass,
    MatFormFieldModule,
    MatInputModule,
    NgStyle,
    MatButtonModule,
  ],
  template: `
    <div [ngStyle]="{ 'padding-top': '100px' }">
      <form [formGroup]="form" (ngSubmit)="signin()">
        <div align="center">
          <mat-form-field>
            <mat-label class="all-font">Enter your email</mat-label>
            <input
              matInput
              placeholder="pat@example.com"
              formControlName="email"
              required
            />
            @if(email.invalid && (email.dirty || email.touched)){
            <div>
              @if(email.hasError('required')){
              <div>Email is required</div>
              } @if(email.hasError('email')){
              <div>Email is not valid</div>
              }
            </div>
            }
          </mat-form-field>
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
            Sign In
          </button>

          @if (form.invalid) {
          <mat-error class="all-font"> Incorrect email or Password?</mat-error>
          }
        </div>
      </form>
    </div>
  `,
  styleUrl: `../style.css`,
})
export class SigninComponent {
  readonly #userService = inject(UserService);
  readonly #router = inject(Router);
  #notification = inject(ToastrService);
  form = inject(FormBuilder).nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: [''],
  });
  get email() {
    return this.form.controls.email;
  }

  signin() {
    this.#userService
      .signin(this.form.value as { email: string; password: string })
      .subscribe({
        next: (response) => {
          if (response.success) {
            const decodedToken = jwtDecode(response.data) as State;

            this.#userService.$state.set({
              _id: decodedToken._id,
              fullname: decodedToken.fullname,
              email: decodedToken.email,
              jwt: response.data,
            });
            this.#notification.success('successfully Signed in.');
            this.#router.navigate(['']);
          }
        },
        error: (error) => {
          this.#notification.error(`Invalid username or Password`);
        },
      });
  }
}

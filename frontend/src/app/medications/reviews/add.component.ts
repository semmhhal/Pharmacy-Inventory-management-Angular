import { Component, inject, signal } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MatButtonModule } from '@angular/material/button';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgStyle } from '@angular/common';
import { UserService } from '../../users/user.service';
import { Router } from '@angular/router';
import { ReviewService } from './review.service';
import { Medication, Review } from '../medication.types';
import { MatIcon } from '@angular/material/icon';
@Component({
  selector: 'app-add',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    NgStyle,
    MatIcon,
  ],
  template: `
    <div [ngStyle]="{ 'padding-top': '40px' }">
      <div align="center" [ngStyle]="{ padding: '70px' }">
        <button
          mat-mini-fab
          aria-label="Example icon button with a home icon"
          (click)="locatetoHome()"
        >
          <mat-icon>home</mat-icon>
        </button>
      </div>
      <form [formGroup]="form">
        <div align="center">
          <mat-form-field>
            <mat-label class="all-font">Enter your Review</mat-label>
            <input
              matInput
              placeholder="Enter your review"
              formControlName="review"
              required
            />
          </mat-form-field>
          <div>
            <input
              style="display:none"
              matInput
              formControlName="rating"
              required
            />

            @for(num of [1,2,3,4,5]; track $index){ @if(StarVal() <= num){
            <button (click)="givenStar($index)" class="Starbutton">
              <mat-icon fontIcon="star" style="color: grey;"></mat-icon>
            </button>
            }@else{
            <button (click)="givenStar($index)" class="Starbutton">
              <mat-icon fontIcon="star" style="color: gold;"></mat-icon>
            </button>
            } }
          </div>
          <button
            (click)="Addreview()"
            mat-flat-button
            type="submit"
            [disabled]="form.invalid"
            class="all-font"
          >
            Add Review
          </button>
        </div>
      </form>
    </div>
  `,
  styleUrl: `../../style.css`,
})
export class AddReviewComponent {
  readonly #reviewService = inject(ReviewService);
  readonly #notification = inject(ToastrService);
  readonly #router = inject(Router);
  StarVal = signal<number>(0);
  med_info = this.#router.getCurrentNavigation()?.extras.state as Medication;
  form = inject(FormBuilder).nonNullable.group({
    review: ['', Validators.required],

    rating: [0, Validators.min(1)],
  });

  givenStar(num: number) {
    this.StarVal.set(num + 2);
    this.form.controls.rating.setValue(this.StarVal() - 1);
  }

  Addreview() {
    this.#reviewService
      .addReview(this.med_info._id, this.form.value as Review)
      .subscribe((response) => {
        if (response.success) {
          this.#notification.success('Added Review Successfully!');
          this.#router.navigate(['', 'medications', this.med_info._id]);
        }
      });
  }

  locatetoHome() {
    this.#router.navigate(['', 'medications']);
  }
}

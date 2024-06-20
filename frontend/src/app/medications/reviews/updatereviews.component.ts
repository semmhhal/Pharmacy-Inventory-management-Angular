import { Component, effect, inject, input } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgStyle } from '@angular/common';
import { UserService } from '../../users/user.service';
import { Router } from '@angular/router';
import { ReviewService } from './review.service';
import { Review } from '../medication.types';
@Component({
  selector: 'app-updatereviews',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    NgStyle,
  ],
  template: ` <div [ngStyle]="{ 'padding-top': '40px' }">
    <form [formGroup]="form" (ngSubmit)="Updatereview()">
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
          <mat-form-field>
            <mat-label class="all-font">Enter Rating</mat-label>
            <input matInput formControlName="rating" required />
          </mat-form-field>
        </div>
        <button
          mat-flat-button
          type="submit"
          [disabled]="form.invalid"
          class="all-font"
        >
          update Review
        </button>
      </div>
    </form>
  </div>`,
  styles: ``,
})
export class UpdatereviewsComponent {
  readonly #router = inject(Router);
  readonly #reviewService = inject(ReviewService);
  readonly #notification = inject(ToastrService);
  medication_id = input<string>('');
  review_id = input<string>('');
  form = inject(FormBuilder).nonNullable.group({
    review: ['', Validators.required],
    rating: 5,
  });

  constructor() {
    effect(() => {
      if (this.review_id()) {
        this.#reviewService
          .getReviewById(this.medication_id(), this.review_id())
          .subscribe((response) => {
            if (response.success) {
              this.form.patchValue(response.data);
            }
          });
      }
    });
  }

  Updatereview() {
    const val = this.form.value as Review;
    this.#reviewService
      .updateReviewById(
        this.medication_id(),
        this.review_id(),
        this.form.value as Review
      )
      .subscribe((response) => {
        if (response.success) {
          this.#notification.success('Updated Successfully!');
          this.#router.navigate(['', 'medications', this.medication_id()]);
        } else {
          this.#notification.error('Cannot update!');
        }
      });
  }
}

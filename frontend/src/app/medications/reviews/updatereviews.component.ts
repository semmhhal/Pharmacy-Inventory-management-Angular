import { Component, effect, inject, input, signal } from '@angular/core';
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
import { MatIcon, MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-updatereviews',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    NgStyle,
    MatIcon,
  ],
  template: ` <div [ngStyle]="{ 'padding-top': '40px' }">
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
          (click)="Updatereview()"
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
  StarVal = signal<number>(0);
  medication_id = input<string>('');
  review_id = input<string>('');
  form = inject(FormBuilder).nonNullable.group({
    review: ['', Validators.required],
    rating: [0, Validators.min(1)],
  });

  constructor() {
    effect(() => {
      if (this.review_id()) {
        this.#reviewService
          .getReviewById(this.medication_id(), this.review_id())
          .subscribe((response) => {
            if (response.success) {
              this.form.patchValue(response.data);
              this.StarVal.set(response.data.rating + 1);
            }
          });
      }
    });
  }

  givenStar(num: number) {
    this.StarVal.set(num + 2);
    this.form.controls.rating.setValue(this.StarVal() - 1);
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

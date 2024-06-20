import { Component, inject, input, signal } from '@angular/core';
import { ReviewService } from './review.service';
import { Router, RouterLink } from '@angular/router';
import { Review } from '../medication.types';
import { DatePipe, NgStyle } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../users/user.service';
import { ToastrService } from 'ngx-toastr';
import { SingleReview } from '../medication.types';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-review',
  standalone: true,
  imports: [
    NgStyle,
    MatCardModule,
    MatButtonModule,
    RouterLink,
    DatePipe,
    MatIconModule,
  ],
  template: `
    <div align="center" [ngStyle]="{ padding: '100px' }">
      <div align="center" [ngStyle]="{ padding: '70px' }">
        <button
          mat-mini-fab
          aria-label="Example icon button with a home icon"
          (click)="locatetoHome()"
        >
          <mat-icon>home</mat-icon>
        </button>
      </div>
      <mat-card class="example-card">
        <mat-card-header>
          <div mat-card-avatar class="example-header-image"></div>
          <h1>
            <mat-card-title>{{ $singleReview().by.fullname }}</mat-card-title>
          </h1>
        </mat-card-header>

        <mat-card-content>
          <mat-card-subtitle>{{ $singleReview().review }}</mat-card-subtitle>
          <p>rating:{{ $singleReview().rating }}</p>

          <p>{{ $singleReview().date | date }}</p>
          @if($singleReview().by.user_id === userService.$state()._id ){
          <button mat-button (click)="go($singleReview()._id!)">Update</button>
          <button mat-button (click)="delete($singleReview()._id!)">
            Delete
          </button>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styleUrl: `../../style.css`,
})
export class ReviewComponent {
  reviewService = inject(ReviewService);
  userService = inject(UserService);
  #router = inject(Router);
  medication_id = input.required<string>();
  notification = inject(ToastrService);
  review_id = input.required<string>();
  $singleReview = signal<Review>(SingleReview);

  ngOnInit() {
    this.reviewService
      .getReviewById(this.medication_id(), this.review_id())
      .subscribe((response) => {
        this.$singleReview.set(response.data);
      });
  }
  go(reviewID: string) {
    this.#router.navigate([
      '',
      'medications',
      this.medication_id(),
      'reviews',
      'update',
      reviewID,
    ]);
  }

  delete(reviewID: string) {
    this.reviewService
      .deleteReviewbyId(this.medication_id(), reviewID)
      .subscribe((response) => {
        if (response.success) {
          this.reviewService.$Reviews.update((old) =>
            old.filter((oldreview) => {
              oldreview._id !== reviewID;
            })
          );
          this.notification.success('Deleted Successfully!');
          this.#router.navigate(['', 'medications', this.medication_id()]);
        }
      });
  }
  locatetoHome() {
    this.#router.navigate(['', 'medications']);
  }
}

import { Component, inject, input } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ReviewService } from './review.service';
import { MedicationService } from '../medication.service';
import { Medication } from '../medication.types';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { DatePipe, NgClass, NgStyle } from '@angular/common';

@Component({
  selector: 'app-listreviews',
  standalone: true,
  imports: [MatListModule, MatIconModule, RouterLink, NgStyle],
  template: `
    <div align="center">
      <div [ngStyle]="{ 'padding-top': '10px' }">
        <div align="center">
          <button
            mat-mini-fab
            aria-label="Example icon button with a home icon"
            (click)="locatetoHome()"
          >
            <mat-icon>home</mat-icon>
          </button>
        </div>
        <h1 mat-subheader>Reviews</h1>
        @for(review of reviewService.$Reviews(); track review._id){
        <mat-list-item>
          <mat-icon matListItemIcon>folder</mat-icon>
          <div
            matListItemTitle
            [routerLink]="[
              '',
              'medications',
              med_info._id,
              'reviews',
              review._id
            ]"
          >
            {{ review.by.fullname }}
          </div>
        </mat-list-item>
        }
      </div>
    </div>
  `,
  styleUrl: `../../style.css`,
})
export class ListreviewsComponent {
  reviewService = inject(ReviewService);
  #router = inject(Router);
  med_info = this.#router.getCurrentNavigation()?.extras.state as Medication;
  constructor() {
    this.reviewService.getReviews(this.med_info._id).subscribe((response) => {
      if (response.success) {
        this.reviewService.$Reviews.set(response.data);
      }
    });
  }

  locatetoHome() {
    this.#router.navigate(['', 'medications']);
  }
}

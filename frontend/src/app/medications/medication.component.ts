import {
  Component,
  effect,
  inject,
  input,
  AfterViewInit,
  signal,
} from '@angular/core';
import { MedicationService } from './medication.service';
import { Availability, Medication, SingleMed } from './medication.types';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { NgStyle } from '@angular/common';
import { UserService } from '../users/user.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ReviewService } from './reviews/review.service';
import { ListreviewsComponent } from './reviews/listreviews.component';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-medication',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    NgStyle,
    RouterLink,
    ListreviewsComponent,
    MatIconModule,
  ],
  template: `
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
      <div align="center" [ngStyle]="{ padding: '10px' }">
        <mat-card class="example-card">
          <mat-card-header>
            <div mat-card-avatar class="example-header-image"></div>
            <mat-card-title>Name:{{ this.$singleMed().name }}</mat-card-title>
            <mat-card-subtitle
              >Availability:{{
                this.$singleMed().availability
              }}</mat-card-subtitle
            >
          </mat-card-header>
          <img
            align="center"
            mat-card-image
            src="http://localhost:3000/medications/images/{{
              this.$singleMed().image._id
            }}"
            alt="{{ this.$singleMed().name }}"
          />
          <mat-card-content>
            <p>Medication-Class:{{ this.$singleMed().medication_class }}</p>
            <p>Added By</p>
            <p>Fullname:{{ this.$singleMed().added_by.fullname }}</p>
            <p>Email:{{ this.$singleMed().added_by.email }}</p>
            @if(this.$singleMed().added_by.user_id === userService.$state()._id
            ) {
            <button mat-button (click)="go(this.$singleMed()._id)">
              Update
            </button>
            <button mat-button (click)="delete(this.$singleMed()._id)">
              Delete
            </button>
            }
          </mat-card-content>
          @if(userService.isLoggedin()){
          <mat-card-actions class="all-font">
            <a
              [routerLink]="[
                '',
                'medications',
                this.$singleMed()._id,
                'reviews',
                'add'
              ]"
              [state]="this.$singleMed()"
            >
              <button mat-button class="all-font">Add Review</button>
            </a> </mat-card-actions
          >}

          <mat-card-actions>
            <a
              [routerLink]="[
                '',
                'medications',
                this.$singleMed()._id,
                'reviews'
              ]"
              [state]="this.$singleMed()"
            >
              <button mat-button class="all-font">View Reviews</button>
            </a>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styleUrl: `../style.css`,
})
export class MedicationComponent {
  medicationService = inject(MedicationService);
  reviewService = inject(ReviewService);
  #router = inject(Router);
  userService = inject(UserService);
  #notification = inject(ToastrService);
  medication_id = input<string>('');
  $showhide = signal<boolean>(true);
  //
  $singleMed = signal<Medication>(SingleMed);

  delete(med_id: string) {
    this.medicationService
      .deleteMedicationById(med_id)
      .subscribe((response) => {
        if (response.success) {
          this.medicationService.$medication.update((old) =>
            old.filter((old_med) => {
              old_med._id !== med_id;
            })
          );
          this.#notification.success('Deleted Successfully!');
          this.#router.navigate(['']);
        } else {
          this.#notification.error('Cannot Delete!!');
        }
      });
  }

  go(medication_id: string) {
    this.#router.navigate(['', 'medications', 'update', medication_id]);
  }
  ngOnInit() {
    if (this.medication_id()) {
      this.medicationService
        .getMedicationById(this.medication_id())
        .subscribe((response) => {
          this.$singleMed.set(response.data);
        });
    } else {
      console.error('Error fetching medication:');
    }
  }
  locatetoHome() {
    this.#router.navigate(['', 'medications']);
  }
}

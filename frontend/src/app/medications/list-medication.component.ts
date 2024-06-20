import { NgStyle } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MedicationService } from './medication.service';
import { Medication } from './medication.types';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../users/user.service';
import { initialState } from '../users/user.types';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list-medication',
  standalone: true,
  imports: [MatButtonToggleModule, MatButtonModule, NgStyle, RouterLink],
  template: `
    <div [ngStyle]="{ padding: '20px' }">
      @if(userService.isLoggedin()){
      <button
        mat-flat-button
        (click)="logout()"
        [ngStyle]="{ padding: '20px' }"
      >
        Log Out</button
      >}
    </div>
    @if(WelcomeShowHide()){
    <h4
      [ngStyle]="{
        'font-family': 'Georgia, serif',
        'font-size': '30px'
      }"
    >
      Welcome, {{ userService.$state().fullname }} 🎉
    </h4>
    }

    <h3
      align="center"
      [ngStyle]="{
        'padding-top': '30px',
        'font-family': 'Georgia, serif',
        'font-size': '70px'
      }"
    >
      Drugs and Medications A to Z
      <div
        align="center"
        [ngStyle]="{
          'padding-top': '30px',
          'font-family': 'Georgia, serif',
          'font-size': '20px'
        }"
      >
        Your Prescription for a Healthier Life.
      </div>
      <p [ngStyle]="{ 'padding-top': '30px' }">
        @if(userService.isLoggedin()){
        <button
          style="margin-right:2%"
          mat-stroked-button
          (click)="go()"
          class="all-font"
        >
          Add New Medication</button
        >}
      </p>
    </h3>

    @for( letters of upperCaseAlphabets; track letters){
    <mat-button-toggle-group>
      <div class="example-button-row">
        <button
          mat-fab
          extended
          color="primary"
          (click)="ListMedications(letters)"
          class="all-font"
        >
          {{ letters }}
        </button>
      </div>
    </mat-button-toggle-group>

    } @for(meds of medService.$medication(); track meds._id){
    <li>
      <a [routerLink]="['', 'medications', meds._id]" class="all-font">{{
        meds.name
      }}</a>
    </li>
    }
  `,
  styleUrl: `../style.css`,
})
export class ListMedicationComponent {
  readonly userService = inject(UserService);
  readonly medService = inject(MedicationService);
  readonly #router = inject(Router);
  readonly notification = inject(ToastrService);
  upperCaseAlphabets: string[] = [];
  WelcomeShowHide = signal<boolean>(true);

  ListMedications(letter: string) {
    this.medService.getMedications(letter).subscribe((response) => {
      this.medService.$medication.set(response.data);
    });
  }

  constructor() {
    this.upperCaseAlphabets = this.generateAlphabets(65, 90);

    setTimeout(() => {
      this.WelcomeShowHide.set(false);
    }, 5000);
  }
  generateAlphabets(start: number, end: number): string[] {
    const alphabets = [];
    for (let i = start; i <= end; i++) {
      alphabets.push(String.fromCharCode(i));
    }
    return alphabets;
  }

  logout() {
    this.userService.$state.set(initialState);
    this.notification.success('Logged Out successfully!');
  }
  go() {
    this.#router.navigate(['', 'medications', 'add']);
  }
}

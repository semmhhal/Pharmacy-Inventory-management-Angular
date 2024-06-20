import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Availability, Medication } from './medication.types';
import { NgClass, NgStyle } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MedicationService } from './medication.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-medication',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    NgClass,
    MatButtonModule,
    MatRadioModule,
    NgStyle,
  ],
  template: `
    <div [ngStyle]="{ 'padding-top': '100px' }">
      <div align="center" [ngStyle]="{ padding: '70px' }">
        <button
          mat-mini-fab
          aria-label="Example icon button with a home icon"
          (click)="locatetoHome()"
        >
          <mat-icon>home</mat-icon>
        </button>
      </div>
      <form [formGroup]="form" (ngSubmit)="AddMed()">
        <div align="center">
          <mat-form-field>
            <mat-label class="all-font">name</mat-label>
            <input
              matInput
              placeholder="Enter your name"
              formControlName="name"
              required
            />
          </mat-form-field>
          <div>
            <mat-form-field>
              <mat-label class="all-font">generic name</mat-label>
              <input
                matInput
                placeholder="generic name"
                formControlName="generic_name"
                required
              />
            </mat-form-field>
          </div>

          <div>
            <mat-form-field>
              <mat-label class="all-font">Enter medication class</mat-label>
              <input matInput formControlName="medication_class" required />
            </mat-form-field>
          </div>
          <div>
            <mat-radio-group
              formControlName="availability"
              aria-label="Select an option"
            >
              <mat-radio-button value="Prescription" class="all-font"
                >Prescription</mat-radio-button
              >
              <mat-radio-button value="OTC" class="all-font"
                >OTC</mat-radio-button
              >
            </mat-radio-group>
          </div>
          <input
            type="file"
            formControlName="image"
            (change)="setFile($event)"
          />
          <button
            mat-flat-button
            type="submit"
            [disabled]="form.invalid"
            class="all-font"
          >
            Add Medication
          </button>
        </div>
      </form>
    </div>
  `,
  styleUrl: `../style.css`,
})
export class AddMedicationComponent {
  file!: File;
  readonly #medicationService = inject(MedicationService);
  readonly #notification = inject(ToastrService);
  readonly #router = inject(Router);
  form = inject(FormBuilder).nonNullable.group({
    image: ['', Validators.required],
    name: ['', Validators.required],
    generic_name: ['', Validators.required],
    medication_class: ['', Validators.required],
    availability: [Availability.Prescription],
  });

  setFile(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.file = input.files[0];
    } else {
      console.error('File selection failed.');
      this.#notification.error('Please select a file.');
    }
  }

  AddMed() {
    const formData = new FormData();

    formData.append('medication_image', this.file);
    formData.append('name', this.form.controls.name.value);
    formData.append('generic_name', this.form.controls.generic_name.value);
    formData.append(
      'medication_class',
      this.form.controls.medication_class.value
    );
    formData.append('availability', this.form.controls.availability.value);

    this.#medicationService.addMedication(formData).subscribe((response) => {
      if (response.success) {
        this.#medicationService.$medication.update((old) => [
          ...old,
          response.data,
        ]);
        this.#notification.success('Added Medication Successfully!');

        this.#router.navigate(['']);
      } else {
        this.#notification.error('Something went wrong!');
      }
    });
  }

  locatetoHome() {
    this.#router.navigate(['', 'medications']);
  }
}

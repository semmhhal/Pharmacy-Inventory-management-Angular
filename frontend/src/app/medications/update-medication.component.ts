import { Component, effect, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  Availability,
  Medication,
  Owner,
  Image,
  Review,
} from './medication.types';
import { NgClass, NgStyle } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { ToastrService } from 'ngx-toastr';
import { MedicationService } from './medication.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-update-medication',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgStyle,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    MatIconModule,
  ],
  template: ` <div [ngStyle]="{ 'padding-top': '100px' }">
    <div align="center" [ngStyle]="{ padding: '70px' }">
      <button
        mat-mini-fab
        aria-label="Example icon button with a home icon"
        (click)="locatetoHome()"
      >
        <mat-icon>home</mat-icon>
      </button>
    </div>
    <form [formGroup]="form" (ngSubmit)="updateMed()">
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
            <input
              matInput
              placeholder="medication class"
              formControlName="medication_class"
              required
            />
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
            <mat-radio-button value="OTC">OTC</mat-radio-button>
          </mat-radio-group>
        </div>
        <input type="file" #fileInput (change)="setFile($event)" />
        <button mat-flat-button type="submit" class="all-font">
          Update Medication
        </button>
      </div>
    </form>
  </div>`,
  styles: `
`,
})
export class UpdateMedicationComponent {
  file!: File | null;
  readonly #router = inject(Router);
  readonly #medicationService = inject(MedicationService);
  readonly #notification = inject(ToastrService);
  medication_id = input<string>('');
  form = inject(FormBuilder).nonNullable.group({
    image: '',
    name: ['', Validators.required],
    first_letter: ['', Validators.required],
    generic_name: ['', Validators.required],
    medication_class: ['', Validators.required],
    availability: [Availability.Prescription, Validators.required],
  });

  setFile(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.file = input.files[0];
      this.form.patchValue({ image: this.file.name });
    }
  }

  constructor() {
    effect(() => {
      if (this.medication_id()) {
        this.#medicationService
          .getMedicationById(this.medication_id())
          .subscribe((response) => {
            this.form.patchValue({
              image: response.data.image.originalname,
              name: response.data.name,
              generic_name: response.data.generic_name,
              medication_class: response.data.medication_class,
              availability: response.data.availability,
            });
          });
      }
    });
  }

  updateMed() {
    const formData = new FormData();
    if (this.file) {
      formData.append('medication_image', this.file);
    }

    formData.append('name', this.form.controls.name.value);
    formData.append('generic_name', this.form.controls.generic_name.value);
    formData.append(
      'medication_class',
      this.form.controls.medication_class.value
    );
    formData.append('availability', this.form.controls.availability.value);

    this.#medicationService
      .updateMedicationById(formData, this.medication_id())
      .subscribe((response) => {
        if (response.data) {
          this.#medicationService.$medication.update((old) =>
            old.map((older) =>
              older._id === this.medication_id()
                ? {
                    ...older,
                    name: this.form.controls.name.value,
                    generic_name: this.form.controls.generic_name.value,
                    medication_class: this.form.controls.medication_class.value,
                    availability: this.form.controls.availability.value,
                    medication_image: this.file,
                  }
                : older
            )
          );
          this.#notification.success('Updated Successfully!');
          this.#router.navigate(['', 'medications', this.medication_id()]);
        } else {
          this.#notification.error('update failed!');
        }
      });
  }
  locatetoHome() {
    this.#router.navigate(['', 'medications']);
  }
}

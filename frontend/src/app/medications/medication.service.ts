import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Medication } from './medication.types';
@Injectable({
  providedIn: 'root',
})
export class MedicationService {
  $medication = signal<Medication[]>([]);
  readonly #http = inject(HttpClient);

  getMedications(firstLetter: string) {
    return this.#http.get<{ success: boolean; data: Medication[] }>(
      environment.BACKEND_SERVER_URL +
        `/medications?first_letter=${firstLetter}`
    );
  }

  getMedicationById(medication_id: string) {
    return this.#http.get<{ success: boolean; data: Medication }>(
      environment.BACKEND_SERVER_URL + '/medications/' + medication_id
    );
  }
  addMedication(NewMedication: FormData) {
    return this.#http.post<{ success: boolean; data: Medication }>(
      environment.BACKEND_SERVER_URL + '/medications',
      NewMedication
    );
  }
  updateMedicationById(UpdateMedication: FormData, medication_id: string) {
    return this.#http.put<{ success: boolean; data: boolean }>(
      environment.BACKEND_SERVER_URL + '/medications/' + medication_id,
      UpdateMedication
    );
  }

  deleteMedicationById(medication_id: string) {
    return this.#http.delete<{ success: boolean; data: boolean }>(
      environment.BACKEND_SERVER_URL + '/medications/' + medication_id
    );
  }
}

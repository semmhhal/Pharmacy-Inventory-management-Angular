import { Router, Routes } from '@angular/router';
import { inject } from '@angular/core';
import { ListMedicationComponent } from './list-medication.component';
import { UserService } from '../users/user.service';

export const med_routes: Routes = [
  {
    path: 'add',
    loadComponent: () =>
      import('./add-medication.component').then(
        (c) => c.AddMedicationComponent
      ),
    canActivate: [() => inject(UserService).isLoggedin()],
  },
  {
    path: 'update/:medication_id',
    loadComponent: () =>
      import('./update-medication.component').then(
        (c) => c.UpdateMedicationComponent
      ),
    canActivate: [() => inject(UserService).isLoggedin()],
  },
  { path: '', component: ListMedicationComponent },
  {
    path: ':medication_id',
    loadComponent: () =>
      import('./medication.component').then((c) => c.MedicationComponent),
  },
  {
    path: ':medication_id/reviews',
    loadChildren: () =>
      import('./reviews/review.routes').then((c) => c.Reviewroutes),
  },
];

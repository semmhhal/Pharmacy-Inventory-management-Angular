import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'medications', pathMatch: 'full' },

  {
    path: 'users',
    loadChildren: () => import('./users/user.routes').then((c) => c.userRoutes),
  },

  {
    path: 'medications',
    loadChildren: () =>
      import('./medications/med.routes').then((c) => c.med_routes),
  },
  { path: '**', redirectTo: 'medications' },
];

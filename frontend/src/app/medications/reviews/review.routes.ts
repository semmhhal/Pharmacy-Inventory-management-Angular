import { Router, Routes } from '@angular/router';

import { ListreviewsComponent } from '../reviews/listreviews.component';

export const Reviewroutes: Routes = [
  { path: '', component: ListreviewsComponent },

  {
    path: 'add',
    loadComponent: () =>
      import('../reviews/add.component').then((c) => c.AddReviewComponent),
  },
  {
    path: 'update/:review_id',
    loadComponent: () =>
      import('../reviews/updatereviews.component').then(
        (c) => c.UpdatereviewsComponent
      ),
  },

  {
    path: ':review_id',
    loadComponent: () =>
      import('../reviews/review.component').then((c) => c.ReviewComponent),
  },
];

import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Review, SingleReview } from '../medication.types';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  readonly #http = inject(HttpClient);
  $Reviews = signal<Review[]>([]);
  getReviews(medication_id: string) {
    return this.#http.get<{ success: boolean; data: Review[] }>(
      environment.BACKEND_SERVER_URL +
        '/medications/' +
        medication_id +
        '/reviews'
    );
  }

  getReviewById(medication_id: string, review_id: string) {
    return this.#http.get<{ success: boolean; data: Review }>(
      environment.BACKEND_SERVER_URL +
        '/medications/' +
        medication_id +
        '/reviews/' +
        review_id
    );
  }

  addReview(medications_id: string, newReview: Review) {
    return this.#http.post<{ success: boolean; data: string }>(
      environment.BACKEND_SERVER_URL +
        '/medications/' +
        medications_id +
        '/reviews',
      newReview
    );
  }

  updateReviewById(
    medication_id: string,
    review_id: string,
    updateReview: Review
  ) {
    return this.#http.put<{ success: boolean; data: boolean }>(
      environment.BACKEND_SERVER_URL +
        '/medications/' +
        medication_id +
        '/reviews/' +
        review_id,
      updateReview
    );
  }

  deleteReviewbyId(medication_id: string, review_id: string) {
    return this.#http.delete<{ success: boolean; data: boolean }>(
      environment.BACKEND_SERVER_URL +
        '/medications/' +
        medication_id +
        '/reviews/' +
        review_id
    );
  }
}

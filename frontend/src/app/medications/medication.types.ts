export type Image = { _id: string; filename: string; originalname: string };
export type Review = {
  _id?: string;
  review: string;
  rating: number;
  by: { user_id: string; fullname: string };
  date: number;
};

export enum Availability {
  Prescription = 'Prescription',
  OTC = 'OTC',
}
export type Owner = { user_id: string; fullname: string; email: string };

export type Medication = {
  _id: string;
  name: string;
  first_letter: string;
  generic_name: string;
  medication_class: string;
  availability: Availability;

  image: Image;
  added_by: Owner;
  reviews: Review[];
};

export const SingleMed = {
  _id: '',
  name: '',
  first_letter: '',
  generic_name: '',
  medication_class: '',
  availability: Availability.Prescription,
  image: { _id: '', filename: '', originalname: '' },
  added_by: { user_id: '', fullname: '', email: '' },
  reviews: [
    {
      review: '',
      rating: 5,
      by: { user_id: '', fullname: '' },
      date: 0,
    },
  ],
};

export const SingleReview = {
  review: '',
  rating: 5,
  by: { user_id: '', fullname: '' },

  date: 0,
};

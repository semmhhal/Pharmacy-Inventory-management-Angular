
 Medication Reviews/Side-Effects application:

The application helps users to review and report medications side effects.

- Implemented a login-based system with JWT.
- Ability to Browse medications and reading reviews is open to guests, but adding, updating, and deleting functionality is restricted to logged-in users.
- State properties in all components and services declared as a `signal`.
- Implement proper lazy-loading techniques for the user-protected components.
- Projects used Angular Material and have proper UI that complies with the web standards. Other UI kits are not permitted.
- Used the latest Angular version features.
- used the `ReactiveFormsModule` when working with form elements (data-driven). The `FormsModule` (template-driven) should not be used.

export type User = { _id: string, fullname: string, email: string, password: string }
export type Image = { filename: string, originalname: string }
export type Review = { review: string, rating: number, by: { user_id: string, fullname: string }, date: number }
export type Owner = { user_id: string, fullname: string, email: string }
export type Medication = {
    name: string,
    first_letter: string,
    generic_name: string,
    medication_class: string,
    availability: string,
    image: Image,
    added_by: Owner,
    reviews: Review[]
}
// POST /users/signin
request_body = { "email": string, "password": string }
response_body = { "success": boolean, "data": string } // JWT token

// POST /users/signup
request_body = { "fullname": string, "email": string, "password": string }
response_body = { "success": boolean, "data": User } // JWT token

// POST /medications
request_body = { "name": string, "generic_name": string, "medication_class": string, "availability": "Prescription" | "OTC" }
request_multipart = "medication_image"
response_body = { "success": boolean, "data": Medication }

// GET /medications?first_letter=A
response_body = { "success": boolean, "data": Medication[] } // only name

// PUT /medications/:medication_id
request_body = { "name": string, "generic_name": string, "medication_class": string, "availability": string }
request_multipart = "medication_image"
response_body = { "success": boolean, "data": boolean }

// GET /medications/:medication_id
response_body = { "success": boolean, "data": Medication } // without reviews

// DELETE /medications/:medication_id
response_body = { "success": boolean, "data": boolean }

// POST /medications/:medication_id/reviews
request_body = { "review": string, "rating": number }
response_body = { "success": boolean, "data": string } // review_id

// GET /medications/:medication_id/reviews
response_body = { "success": boolean, "data": Review[] } // only name

// PUT /medications/:medication_id/reviews/:review_id
request_body = { "review": string, "rating": number }
response_body = { "success": boolean, "data": boolean }

// GET /medications/:medication_id/reviews/:review_id
response_body = { "success": boolean, "data": Review }

// DELETE /medications/:medication_id/reviews/:review_id
response_body = { "success": boolean, "data": boolean }

// GET /medications/images/:image_id
response_body = Binary of image file
```

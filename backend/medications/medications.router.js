import { Router } from "express";
import multer from "multer";
import {
  add_medication,
  get_medications_by_first_letter,
  get_medication_by_id,
  delete_medication_by_id,
  update_medication_by_id,
  add_reviews,
  get_reviews,
  get_review_by_id,
  delete_review_by_id,
  update_review_by_id,
  get_image_by_image_id,
} from "./medications.controller.js";
import { checkToken } from "../users/users.middleware.js";

const router = Router();

router.get("/images/:image_id", get_image_by_image_id);

router.post(
  "/",
  multer({ dest: "uploads/" }).single("medication_image"),
  checkToken,
  add_medication
);
router.get("/", get_medications_by_first_letter);
router.get("/:medication_id", get_medication_by_id);

router.delete("/:medication_id", checkToken, delete_medication_by_id);
router.put(
  "/:medication_id",
  multer({ dest: "uploads/" }).single("medication_image"),
  checkToken,
  update_medication_by_id
);

router.post("/:medication_id/reviews", checkToken, add_reviews);
router.get("/:medication_id/reviews/", get_reviews);
router.get("/:medication_id/reviews/:review_id", get_review_by_id);
router.delete(
  "/:medication_id/reviews/:review_id",
  checkToken,
  delete_review_by_id
);
router.put(
  "/:medication_id/reviews/:review_id",
  checkToken,
  update_review_by_id
);

export default router;

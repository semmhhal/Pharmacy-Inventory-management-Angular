import { Types } from "mongoose";
import { ErrorResponse } from "../error.js";
import Medication from "./medications.model.js";
import path from "path";

export const add_medication = async (req, res, next) => {
  try {
    const { tokenData } = req.body;
    const new_medication = req.body;
    const query = {
      ...new_medication,
      first_letter: new_medication.name[0].toUpperCase(),
      added_by: {
        user_id: tokenData._id,
        fullname: tokenData.fullname,
        email: tokenData.email,
      },
    };

    if (req.file) {
      const { originalname, filename } = req.file;
      query.image = { filename, originalname };
    }

    const results = await Medication.create(query);
    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};

export const get_medications_by_first_letter = async (req, res, next) => {
  try {
    const { first_letter = "A" } = req.query;

    const results = await Medication.find(
      { first_letter: first_letter.toUpperCase() },
      { name: 1 }
    ).lean();
    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};
export const get_medication_by_id = async (req, res, next) => {
  try {
    const { medication_id } = req.params;

    const results = await Medication.findOne({ _id: medication_id }).lean();
    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};

export const update_medication_by_id = async (req, res, next) => {
  try {
    const { medication_id } = req.params;
    const { tokenData, name, generic_name, medication_class, availability } =
      req.body;

    const query = {
      name,
      generic_name,
      medication_class,
      availability,
      first_letter: name[0].toUpperCase(),
    };

    if (req.file) {
      const { originalname, filename } = req.file;
      query.image = { filename, originalname };
    }

    const results = await Medication.updateOne(
      { _id: medication_id, "added_by.user_id": tokenData._id },
      { $set: query }
    );

    if (results.matchedCount === 0) {
      throw new ErrorResponse(
        "User is not authorized to change this medication",
        404
      );
    } else {
      res.json({ success: true, data: results.modifiedCount ? true : false });
    }
  } catch (error) {
    next(error);
  }
};

export const delete_medication_by_id = async (req, res, next) => {
  try {
    const { medication_id } = req.params;
    const { tokenData } = req.body;

    const results = await Medication.deleteOne({
      _id: medication_id,
      "added_by.user_id": tokenData._id,
    });
    if (results.matchedCount === 0) {
      throw new ErrorResponse(
        "User is not authorized to delete this medication",
        404
      );
    } else {
      res.json({ success: true, data: results.deletedCount ? true : false });
    }
  } catch (error) {
    next(error);
  }
};

export const add_reviews = async (req, res, next) => {
  try {
    const { medication_id } = req.params;
    const { tokenData, review, rating } = req.body;
    const _id = new Types.ObjectId();
    const results = await Medication.updateOne(
      { _id: medication_id },
      {
        $addToSet: {
          reviews: {
            _id,
            review,
            rating,
            by: { user_id: tokenData._id, fullname: tokenData.fullname },
          },
        },
      }
    );
    res.json({ success: true, data: results.modifiedCount ? _id : "" });
  } catch (error) {
    next(error);
  }
};
export const get_reviews = async (req, res, next) => {
  try {
    const { medication_id } = req.params;

    const results = await Medication.findOne(
      { _id: medication_id },
      { reviews: 1, _id: 0 }
    ).lean();
    results && res.json({ success: true, data: results.reviews });
  } catch (error) {
    next(error);
  }
};
export const get_review_by_id = async (req, res, next) => {
  try {
    const { medication_id, review_id } = req.params;

    const results = await Medication.findOne(
      { _id: medication_id, "reviews._id": review_id },
      { "reviews.$": 1, _id: 0 }
    ).lean();
    //console.log(results, " get  review");
    if (results) {
      res.json({
        success: true,
        data: results.reviews.length ? results.reviews[0] : {},
      });
    } else {
      res.json({ success: true, data: {} });
    }
  } catch (error) {
    next(error);
  }
};

export const delete_review_by_id = async (req, res, next) => {
  try {
    const { medication_id, review_id } = req.params;
    const {
      tokenData: { _id: user_id },
    } = req.body;
    const results = await Medication.updateOne(
      {
        _id: medication_id,
        "reviews._id": review_id,
        "reviews.by.user_id": user_id,
      },
      { $pull: { reviews: { _id: review_id } } }
    );
    res.json({ success: true, data: results.modifiedCount ? true : false });
  } catch (error) {
    next(error);
  }
};

export const update_review_by_id = async (req, res, next) => {
  try {
    const { medication_id, review_id } = req.params;
    const {
      review,
      rating,
      tokenData: { _id: user_id },
    } = req.body;

    const review_details = await Medication.findOne(
      { _id: medication_id, "reviews._id": review_id },
      { "reviews.$": 1, _id: 0 }
    ).lean();
    if (review_details.reviews[0].by.user_id.toString() !== user_id)
      throw Error("User is not authorized to change this review");

    const results = await Medication.updateOne(
      { _id: medication_id, "reviews._id": review_id },
      {
        $set: {
          "reviews.$.review": review,
          "reviews.$.rating": rating,
          "reviews.$.date": Date.now(),
        },
      }
    );
    res.json({ success: true, data: results.modifiedCount ? true : false });
  } catch (error) {
    next(error);
  }
};

export const get_image_by_image_id = async (req, res, next) => {
  const { image_id } = req.params;
  const results = await Medication.findOne(
    { "image._id": image_id },
    { image: 1, _id: 0 }
  ).lean();
  const url = path.join("./", "uploads", results.image.filename);
  res.sendFile(path.resolve(url));
};

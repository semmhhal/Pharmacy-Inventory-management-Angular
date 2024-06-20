import mongoose, { Schema, model } from 'mongoose';

const schema = new Schema({
    name: { type: String, required: true },
    first_letter: { type: String, required: true },
    generic_name: { type: String, required: true },
    medication_class: { type: String, required: true },
    availability: { type: String, enum: ["Prescription", "OTC"], default: "Prescription" },
    image: {
        type: { filename: String, originalname: String },
        default: { filename: "generic.png", originalname: "generic.png" }
    },
    added_by: {
        user_id: mongoose.Types.ObjectId,
        fullname: String,
        email: String
    },
    reviews: [{
        review: { type: String, required: true },
        rating: { type: Number, required: true },
        by: { user_id: mongoose.Types.ObjectId, fullname: String },
        date: { type: Number, required: true, default: Date.now },
    }],
}, { timestamps: true })

export default model('medication', schema)
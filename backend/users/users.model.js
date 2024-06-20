import { Schema, model } from 'mongoose';

const schema = new Schema({
    fullname: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
})

export default model('user', schema)
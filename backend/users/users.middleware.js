import jwt from "jsonwebtoken";
import { ErrorResponse } from "../error.js";

export const checkToken = async (req, res, next) => {
    try {
        const header = req.headers['authorization'];
        if (!header) throw new ErrorResponse(`Token is required`, 401);

        const token = header.split(' ')[1]
        if (!token) throw new ErrorResponse(`Token is not correct`, 401);

        const decoded_token = jwt.verify(token, process.env.JWT_PRIVATE_KEY)
        if (!decoded_token) throw new ErrorResponse(`Wrong Token Signature`, 401);

        req.body['tokenData'] = decoded_token;
        next()
    } catch (e) {
        next(e)
    }
}
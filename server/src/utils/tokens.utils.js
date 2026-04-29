import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

// generate Access token 
const generateAccessToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            role: user.role
        },
        process.env.JWT_ACCESS_SECRET,
        {
            expiresIn: process.env.JWT_ACCESS_EXPIRES_IN
        }
    )
}

// generate Refresh token 
const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            role: user.role
        },
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn: process.env.JWT_REFRESH_EXPIRES_IN
        }
    )
}

// export 
export {
    generateAccessToken,
    generateRefreshToken
}
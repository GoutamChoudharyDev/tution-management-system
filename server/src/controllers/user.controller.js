import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../utils/tokens.utils.js";
import jwt, { decode } from "jsonwebtoken";

// Cookie options
const isProd = process.env.NODE_ENV === "production";

const cookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "None" : "Lax",
    path: "/"
};

// register controller
const userRegister = async (req, res) => {
    try {
        // taking data from frontend(req.body)
        const { name, email, password, classId } = req.body;

        // validation
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        // check for user existing
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exist"
            })
        }

        // hased password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            classId
        })

        // safe user object
        const safeUser = {
            id: user._id,
            name: user.name,
            email: user.email,
            classId: user.classId,
            status: user.status,
            role: user.role
        }

        // return response
        return res.status(201).json({
            message: "User created successfully",
            user: safeUser
        })
    } catch (error) {
        console.log("REGISTER ERROR:", error);
        res.status(500).json({ message: "Server error" });
    }
}

const userLogin = async (req, res) => {
    try {
        // taking data from frontend(req.body)
        const { email, password } = req.body;

        // validation 
        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        // check user existing
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid credentials"
            })
        }

        // compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid credentials"
            })
        }

        // check approval status
        if (user.status !== "approved") {
            return res.status(403).json({
                message: "Account not approved yet",
            });
        }

        // generate tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // set tokens in cookies
        res.cookie("accessToken", accessToken, {
            ...cookieOptions,
            maxAge: 15 * 60 * 1000 // 15 min
        })

        res.cookie("refreshToken", refreshToken, {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })

        // safe user object
        const safeUser = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            classId: user.classId,
        }

        // return response
        return res.status(200).json({
            message: "User loggedIn successfully",
            user: safeUser,
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error during login"
        })
    }
}

// refresh token 
const refreshAccessToken = async (req, res) => {
    try {
        // get refreshToken from cookies
        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({ message: "No refresh token" });
        }

        // verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        // find user
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // also check status
        if (user.status !== "approved") {
            return res.status(403).json({
                message: "User not allowed"
            });
        }

        // generate new accessToken
        const newAccessToken = generateAccessToken(user);

        // store accesstoken in cookie
        res.cookie("accessToken", newAccessToken, {
            ...cookieOptions,
            maxAge: 15 * 60 * 1000
        })

        // return response
        return res.status(200).json({
            message: "Access token refreshed",
            user: decoded
        })
    } catch (error) {
        res.status(403).json({
            message: "Invalid refresh token"
        });
    }
}

// logout controller
const userLogout = async (req, res) => {
    try {
        res.clearCookie("accessToken", cookieOptions);
        res.clearCookie("refreshToken", cookieOptions);

        return res.status(200).json({
            message: "User logged out successfully"
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error during register"
        })
    }
}

// exports
export {
    userRegister,
    userLogin,
    refreshAccessToken,
    userLogout
}
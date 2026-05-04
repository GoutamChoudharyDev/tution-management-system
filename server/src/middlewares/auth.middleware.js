import jwt from "jsonwebtoken";

// protected routes middleware for users
const isAuth = (req, res, next) => {
    try {
        // get token
        const token = req.cookies?.accessToken;

        if (!token) {
            return res.status(401).json({
                message: "Unautherized access"
            })
        }

        // verify token
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        // set in req.user 
        req.user = decoded;

        // call next 
        next();
    } catch (error) {
        return res.status(403).json({
            message: "Invalid or expired token"
        });
    }
}

// protected route middleware for admin
const isAdmin = (req, res, next) => {
    // check role for admin
    if (req.user.role !== "admin") {
        return res.status(403).json({
            message: "Access denied"
        })
    }

    // call next
    next();
}

// exports
export {
    isAuth,
    isAdmin
}
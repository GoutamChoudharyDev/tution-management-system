import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.route.js"

const app = express();

// default route
app.get("/", (req, res) => {
    res.send("Backend is running!")
})

//! Middlewares
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

//! Routes
app.use("/api/auth", userRoutes)

//! Export
export default app; 
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

//? import routes... 
import userRoutes from "./routes/user.route.js";
import classRoutes from "./routes/class.route.js";
import adminRoutes from "./routes/admin.route.js";
import studentRoutes from "./routes/student.route.js";

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
app.use("/api/auth", userRoutes);
app.use("/api/class", classRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/student", studentRoutes);

//! Export
export default app; 
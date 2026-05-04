import { Router } from "express";
import { getClassAttendance, markAttendance } from "../controllers/attendance.controller.js";
import { isAdmin, isAuth } from "../middlewares/auth.middleware.js";
import { getMyAttendance } from "../controllers/student.controller.js";

const router = Router();

//! (Admin) 
router.post("/mark", isAuth, isAdmin, markAttendance);
router.get("/class/:classId", isAuth, isAdmin, getClassAttendance)
router.get("/my", isAuth, getMyAttendance);
export default router;
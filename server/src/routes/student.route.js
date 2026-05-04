import { Router } from "express";
import { isAuth } from "../middlewares/auth.middleware.js";
import { getMyClass, getMyProfile } from "../controllers/student.controller.js";

const router = Router();

//! Student APIs
router.get("/me", isAuth, getMyProfile);
router.get("/my-class", isAuth, getMyClass);

export default router;
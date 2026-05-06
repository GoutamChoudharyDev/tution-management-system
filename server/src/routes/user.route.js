import { Router } from "express";
import { getMe, refreshAccessToken, userLogin, userLogout, userRegister } from "../controllers/user.controller.js";
import { isAuth } from "../middlewares/auth.middleware.js";

const router = Router();

//! auth api's 
router.post("/register", userRegister);
router.post("/login", userLogin);
router.post("/logout", userLogout);

router.get("/refresh-token", refreshAccessToken);
router.get("/me", isAuth, getMe);

export default router;
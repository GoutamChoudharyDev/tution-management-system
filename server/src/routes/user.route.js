import { Router } from "express";
import { refreshAccessToken, userLogin, userLogout, userRegister } from "../controllers/user.controller.js";

const router = Router();

router.post("/register", userRegister);
router.post("/login", userLogin);
router.get("/refresh-token", refreshAccessToken);
router.post("/logout", userLogout);

export default router;
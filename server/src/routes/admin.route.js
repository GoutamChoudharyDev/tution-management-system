import { Router } from "express";
import { isAdmin, isAuth } from "../middlewares/auth.middleware.js";
import { approveUser, getAllUsers } from "../controllers/admin.controller.js";

const router = Router();

router.patch("/approve-user/:userId", isAuth, isAdmin, approveUser);
router.get("/users", isAuth, isAdmin, getAllUsers);

export default router;
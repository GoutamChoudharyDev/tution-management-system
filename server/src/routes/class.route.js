import { Router } from "express";
import {
    addStudentToClass, createClass,
    deleteClass, getAllClasses,
    getSingleClass, removeStudentToClass,
    updateClass, getAllStudentsOfClass,
} from "../controllers/class.controller.js";
import { isAdmin, isAuth } from "../middlewares/auth.middleware.js";

const router = Router();

//! Admin(CRUD of class)
router.post("/create", isAuth, isAdmin, createClass);
router.patch("/:id", isAuth, isAdmin, updateClass);
router.delete("/:id", isAuth, isAdmin, deleteClass);
router.post("/add-student", isAuth, isAdmin, addStudentToClass);
router.post("/remove-student", isAuth, isAdmin, removeStudentToClass);
router.get("/:id/students", isAuth, isAdmin, getAllStudentsOfClass);

//! public
router.get("/", isAuth, getAllClasses);
router.get("/single-class/:id", isAuth, getSingleClass);

export default router;
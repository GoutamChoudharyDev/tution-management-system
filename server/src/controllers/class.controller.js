import { response } from "express";
import { Class } from "../models/class.model.js";

// createClass controller
const createClass = async (req, res) => {
    try {
        // get data
        const { name, subject } = req.body;

        // validation
        if (!name) {
            return res.status(400).json({
                message: "Class name is required"
            })
        }

        // create class
        const newClass = await Class.create({
            name,
            subject,
            createdBy: req.user.id
        })

        return res.status(201).json({
            message: "Class created successfully",
            newClass
        })
    } catch (error) {
        console.log("class create error : ", error);
        res.status(500).json({
            message: "Server error"
        });
    }
}

// updateClass controller
const updateClass = async (req, res) => {
    try {
        // get id from req.params and name and subject from body
        const { id } = req.params;

        const { name, subject } = req.body;

        // find class by id and update
        const updatedClass = await Class.findByIdAndUpdate(
            id,
            { name, subject },
            { new: true }
        )

        // validate
        if (!updatedClass) {
            return res.status(404).json({
                message: "Class not found"
            });
        }

        // response
        return res.status(200).json({
            message: "Class updated",
            class: updatedClass
        })

    } catch (error) {
        console.log("class updateClass error : ", error);
        res.status(500).json({
            message: "Server error"
        });
    }
}

// deleteClass controller
const deleteClass = async (req, res) => {
    try {
        // get id from req.params
        const { id } = req.params;

        const deletedClass = await Class.findByIdAndDelete(id);

        // validate
        if (!deletedClass) {
            return res.status(404).json({
                message: "Class not found"
            });
        }

        // response
        return res.status(200).json({
            message: "Class deleted",
            class: deletedClass
        })
    } catch (error) {
        console.log("class deleteClass error : ", error);
        res.status(500).json({
            message: "Server error"
        });
    }
}

// getAllClasses controller
const getAllClasses = async (req, res) => {
    try {
        const allClasses = await Class.find().sort({ createdAt: -1 });

        // respone
        return res.status(200).json({
            message: "All classes fetched",
            allClasses
        })
    } catch (error) {
        console.log("class getAllClasses error : ", error);
        res.status(500).json({
            message: "Server error"
        });
    }
}

// get single calls
const getSingleClass = async (req, res) => {
    try {
        const { id } = req.params;

        const singleClass = await Class
            .findById(id)
            .populate("createdBy", "name email");

        if (!singleClass) {
            return res.status(404).json({
                message: "Class not found"
            });
        }

        return res.status(200).json({
            class: singleClass
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// addStudent to class
const addStudentToClass = async (req, res) => {
    try {
        // get student and class id
        const { classId, studentId } = req.body;

        // validation
        if (!classId || !studentId) {
            return res.status(400).json({
                message: "ClassId and StudentId required"
            })
        }

        // update class(add student to class)
        const updatedClass = await Class.findByIdAndUpdate(
            classId,
            { $addToSet: { students: studentId } },
            { returnDocument: "after" }
        )

        if (!updatedClass) {
            return res.status(404).json({
                message: "Class not found"
            })
        }

        return res.status(200).json({
            message: "Student added successfully",
            class: updatedClass
        });

    } catch (error) {
        console.log("Add student error:", error);
        res.status(500).json({ message: "Server error" });
    }
}

// removeStudent to class
const removeStudentToClass = async (req, res) => {
    try {
        // get studentid and classid
        const { studentId, classId } = req.body;

        // validation
        if (!studentId || !classId) {
            return status(400).json({
                message: "StudentId and ClassId required"
            })
        }

        // update class (remove student to class)
        const updatedClass = await Class.findByIdAndUpdate(
            classId,
            { $pull: { students: studentId } },
            { returnDocument: "after" }
        )

        if (!updatedClass) {
            return res.status(404).json({
                message: "Class not found"
            })
        }

        // return response
        return res.status(200).json({
            message: "Student remove successfully",
            class: updatedClass
        })
    } catch (error) {
        console.log("Remove student error:", error);
        res.status(500).json({ message: "Server error" });
    }
}

// get students of class
const getAllStudentsOfClass = async (req, res) => {
    try {
        // get class id from req.params
        const { id } = req.params;

        const students = await Class.findById(id).populate("students", "name email");

        if (!students) {
            return res.status(404).json({
                message: "Class not found"
            })
        }

        // response
        return res.status(200).json({
            message: "Students fetch successfully",
            students
        })
    } catch (error) {
        console.log("Fetch student error:", error);
        res.status(500).json({ message: "Server error" });
    }
}

// exports 
export {
    createClass,
    updateClass,
    deleteClass,
    getAllClasses,
    getSingleClass,
    addStudentToClass,
    removeStudentToClass,
    getAllStudentsOfClass
}
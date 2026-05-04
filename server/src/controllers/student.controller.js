import { Class } from "../models/class.model.js";
import { User } from "../models/user.model.js"

// getMyProfile controller
const getMyProfile = async (req, res) => {
    try {
        // find user by id
        const studentId = req.user.id;

        if (req.user.role !== "student") {
            return res.status(403).json({
                message: "Access denied. Only students allowed"
            })
        }

        const user = await User.findById(studentId).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        return res.status(200).json({
            user
        })
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

// getMyClass controller
const getMyClass = async (req, res) => {
    try {
        const studentId = req.user.id;

        if (req.user.role !== "student") {
            return res.status(403).json({
                message: "Access denied. Only students allowed"
            })
        }

        const myClass = await Class.findOne({
            students: studentId
        }).populate("createdBy", "name email");

        if (!myClass) {
            return res.status(404).json({
                message: "You are not enrolled in any class"
            });
        }

        return res.status(200).json({
            class: myClass
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

// export
export {
    getMyProfile,
    getMyClass
}
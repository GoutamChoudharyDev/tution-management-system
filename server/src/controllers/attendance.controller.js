import { Attendance } from "../models/attendance.model.js";

//! mark attendance controller(admin)
const markAttendance = async (req, res) => {
    try {
        const { classId, date, records } = req.body;

        if (!classId || !date || !records) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        // check if already exists(avoid duplicate)
        const existing = await Attendance.findOne({ classId, date });

        if (existing) {
            return res.status(400).json({
                message: "Attendance already marked for this date"
            })
        }

        const attendance = await Attendance.create({
            classId,
            date,
            records
        })

        return res.status(201).json({
            message: "Attendance marked",
            attendance
        });
    } catch (error) {
        console.log("ERROR : in mark attendance: ", error);
        res.status(500).json({ message: "Server error" });
    }
}

//! getClassAttendance controller(Admin)
const getClassAttendance = async (req, res) => {
    try {
        const { classId } = req.params;

        const attendance = await Attendance.find({ classId });

        return res.status(200).json({
            message: "attendance get successfully",
            attendance
        })
    } catch (error) {
        console.log("ERROR : in get attendance: ", error);
        res.status(500).json({ message: "Server error" });
    }
}

// exports
export { 
    markAttendance,
    getClassAttendance
}
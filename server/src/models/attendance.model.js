import mongoose, { Schema } from "mongoose";

const attendanceSchema = new Schema({
    classId: {
        type: Schema.Types.ObjectId,
        ref: "Class",
        required: true
    },
    date: {
        type: String, // simple ("2026-05-04")
        required: true
    },
    records: [{
        student: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        status: {
            type: String,
            enum: ["present", "absent"],
            default: "absent"
        }
    }]
}, { timestamps: true });

export const Attendance = mongoose.model("Attendance", attendanceSchema);
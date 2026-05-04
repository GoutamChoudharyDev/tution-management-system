import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["student", "admin"],
        default: "student",
    },
    classes: [
        {
            type: Schema.Types.ObjectId,
            ref: "Class"
        }
    ],
    status: {
        type: String,
        enum: ["pending", "approved"],
        default: "pending",
    },
}, { timestamps: true })

export const User = mongoose.model("User", userSchema);
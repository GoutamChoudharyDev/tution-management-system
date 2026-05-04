import mongoose, { Schema } from "mongoose";

const classSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    subject: {
        type: String
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    students: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ]
}, { timestamps: true })

export const Class = mongoose.model("Class", classSchema);
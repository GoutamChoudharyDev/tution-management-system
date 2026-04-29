import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/tution-system`);
        console.log("Database connected successfully");
    } catch (error) {
        console.log("DB ERROR : ", error);
        process.exit(1);
    }
}

export { connectDB }
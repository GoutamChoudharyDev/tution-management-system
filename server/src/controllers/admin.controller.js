import { User } from "../models/user.model.js"

const approveUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findByIdAndUpdate(
            userId,
            { status: "approved" },
            { new: true }
        )

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "User approved successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status
            }
        });
    } catch (error) {
        console.log("approveUser error:", error);
        res.status(500).json({
            message: "Server error"
        });
    }
}

// get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password").sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Users fetched successfully",
            users
        });
    } catch (error) {
        console.log("getAllUsers error:", error);
        res.status(500).json({
            message: "Server error"
        });
    }
}

// exports
export {
    approveUser,
    getAllUsers
}
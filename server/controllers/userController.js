import UserModel from '../models/userModel.js';

import jwt from 'jsonwebtoken';

export const getCurrentUser = async (req, res) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(200).json({ user: null });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(200).json({ user: null });
        }

        const userId = decoded.userId;
        if (!userId) {
            return res.status(200).json({ user: null });
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(200).json({ user: null });
        }

        // Ensure legacy users get the current default credits.
        if (!user.credits || user.credits < 50) {
            user.credits = 50;
            user.isCreditAvailable = true;
            await user.save();
        }

        return res.status(200).json({ user });
    } catch (error) {
        console.error("getCurrentUser error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

import UserModel from "../models/userModel.js";
import { generateToken } from "../utils/token.js";


export const googleAuth = async (req, res) => {
  try {
    const { name, email } = req.body;

    console.log("Auth request body:", { name, email });

    if (!email || email.trim() === "") {
      return res.status(400).json({ message: "Email is required" });
    }

    let user = await UserModel.findOne({ email });

    // ✅ Create new user
    if (!user) {
      user = await UserModel.create({
        name: name || "User",
        email,
        credits: 50,
        isCreditAvailable: true,
      });
      console.log("New user created:", user._id);
    } else {
      console.log("Existing user found:", user._id);
    }

    // ✅ Fix legacy users
    if (!user.credits || user.credits < 50) {
      user.credits = 50;
      user.isCreditAvailable = true;
      await user.save();
    }

    const token = await generateToken(user._id);

    const isProd = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    console.log("Auth successful, token set for user:", user._id);
    return res.status(200).json({ user });

  } catch (err) {
    console.error("GOOGLE AUTH ERROR:", err);

    return res.status(500).json({
      message: "Error during Google authentication",
      error: err.message,
    });
  }
};

export const logout = async (req, res) => {
    try{
        await res.clearCookie("token")
        return res.status(200).json({message: "Logged out successfully"});
    } catch (error) {
        return res.status(500).json({ message: "Error during logout" });
    }
}


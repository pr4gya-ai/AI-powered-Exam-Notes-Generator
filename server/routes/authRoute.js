import express from "express";
import { googleAuth, logout } from "../controllers/authController.js";

const authRoute = express.Router();

authRoute.post("/google", googleAuth);
authRoute.get("/logout", logout);

export default authRoute;
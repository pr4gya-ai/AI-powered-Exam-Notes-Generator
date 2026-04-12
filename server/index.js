import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import connectDb from "./utils/connectDb.js";
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import creditsRoute from "./routes/creditsRoute.js";
import generateRoute from "./routes/generateRoute.js";
import pdfRoute from "./routes/pdfRoute.js";
// import stripeWebhook from "./routes/stripeWebhook.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// 🔥 Stripe Webhook (MUST be before express.json)
app.post(
  "/api/credits/webhook",
  express.raw({ type: "application/json" }),
  (req, res) => {
    // TODO: Add your stripeWebhook logic here
    console.log("Webhook received");
    res.sendStatus(200);
  }
);

// ✅ Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Test Route
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Exam Notes AI Backend Running 🚀",
  });
});

// ✅ API Routes
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/credits", creditsRoute);
app.use("/api/generate", generateRoute);
app.use("/api/pdf", pdfRoute);

// ❌ 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// 🔥 Global Error Handler (IMPORTANT)
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// 🚀 Start Server
const start = async () => {
  try {
    await connectDb();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server start failed:", error.message);
  }
};

start();
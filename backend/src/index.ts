import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import carsRouter from "./routes/cars.js";
import authRouter from "./routes/auth.js";
import bookingsRouter from "./routes/bookings.js";
import reviewsRouter from "./routes/reviews.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
}));
app.use(express.json());

// Health check
app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/", (_req, res) => {
    res.send("Welcome to the Renture API Host.");
});

// Routes
app.use("/api/cars", carsRouter);
app.use("/api/auth", authRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/api/reviews", reviewsRouter);

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`🚗 Renture API running at http://localhost:${PORT}`);
    console.log(`   Health check: http://localhost:${PORT}/api/health`);
});

export default app;

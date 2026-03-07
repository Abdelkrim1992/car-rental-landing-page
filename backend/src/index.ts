import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import carsRouter from "./routes/cars.js";
import authRouter from "./routes/auth.js";
import bookingsRouter from "./routes/bookings.js";
import reviewsRouter from "./routes/reviews.js";
import messagesRouter from "./routes/messages.js";
import settingsRouter from "./routes/settings.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { initWebSocketServer } from "./wsServer.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Create HTTP server wrapping Express
const server = createServer(app);

// Attach WebSocket server to the HTTP server
initWebSocketServer(server);

// Middleware
app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins: string[] = [];

        if (process.env.FRONTEND_URL) {
            allowedOrigins.push(process.env.FRONTEND_URL);
        }

        // Only allow localhost if we are not in a production environment
        if (process.env.NODE_ENV !== "production") {
            allowedOrigins.push("http://localhost:3000", "http://localhost:3001");
        }

        // Allow requests with no origin (e.g. mobile apps, curl) or if origin is in the list
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
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
app.use("/api/messages", messagesRouter);
app.use("/api/settings", settingsRouter);

// Error handler
app.use(errorHandler);

// Use server.listen instead of app.listen for WebSocket support
server.listen(PORT, () => {
    console.log(`🚗 Renture API running at http://localhost:${PORT}`);
    console.log(`   Health check: http://localhost:${PORT}/api/health`);
    console.log(`📡 WebSocket server ready on ws://localhost:${PORT}`);
});

export default app;

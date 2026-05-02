import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(
	cors({
		origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
		credentials: true,
	}),
);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api", chatRoutes);

app.use((err, req, res, next) => {
	console.error(err);
	res.status(500).json({ error: "Internal server error" });
});

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI);
		console.log("Database Connected");
	} catch (err) {
		console.log("Failed to Connect Database: ", err);
		process.exit(1);
	}
};

const start = async () => {
	await connectDB();
	app.listen(PORT, () => {
		console.log("Server running on port: " + PORT);
	});
};

start();

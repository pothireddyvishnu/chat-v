import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

const IS_PROD = process.env.NODE_ENV === "production";

export const COOKIE_OPTIONS = {
	httpOnly: true,
	sameSite: IS_PROD ? "none" : "lax",
	secure: IS_PROD,
	maxAge: 7 * 24 * 60 * 60 * 1000,
};

function signToken(userId) {
	return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

router.post("/signup", async (req, res) => {
	const { name, email, password } = req.body;
	if (!name || !email || !password) {
		return res.status(400).json({ error: "Missing required fields" });
	}
	try {
		const existing = await User.findOne({ email: email.toLowerCase() });
		if (existing) {
			return res.status(409).json({ error: "Email already registered" });
		}
		const user = await User.create({ name, email, password });
		const token = signToken(user._id);
		res.cookie("token", token, COOKIE_OPTIONS);
		res.status(201).json({
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				theme: user.theme,
			},
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: "Signup failed" });
	}
});

router.post("/login", async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(400).json({ error: "Missing required fields" });
	}
	try {
		const user = await User.findOne({ email: email.toLowerCase() }).select(
			"+password",
		);
		if (!user) {
			return res.status(401).json({ error: "Invalid credentials" });
		}
		const ok = await user.comparePassword(password);
		if (!ok) {
			return res.status(401).json({ error: "Invalid credentials" });
		}
		const token = signToken(user._id);
		res.cookie("token", token, COOKIE_OPTIONS);
		res.json({
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				theme: user.theme,
			},
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: "Login failed" });
	}
});

router.post("/logout", (req, res) => {
	res.clearCookie("token", COOKIE_OPTIONS);
	res.json({ success: "Logged out" });
});

router.get("/me", auth, async (req, res) => {
	try {
		const user = await User.findById(req.userId);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}
		res.json({
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				theme: user.theme,
			},
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: "Failed to fetch user" });
	}
});

export default router;

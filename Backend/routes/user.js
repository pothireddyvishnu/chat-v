import express from "express";
import User from "../models/User.js";
import Thread from "../models/Thread.js";
import auth from "../middlewares/auth.js";
import { COOKIE_OPTIONS } from "./auth.js";

const router = express.Router();

router.use(auth);

router.put("/profile", async (req, res) => {
	const { name, email } = req.body;
	if (!name && !email) {
		return res.status(400).json({ error: "Nothing to update" });
	}
	try {
		if (email) {
			const existing = await User.findOne({
				email: email.toLowerCase(),
				_id: { $ne: req.userId },
			});
			if (existing) {
				return res
					.status(409)
					.json({ error: "Email already in use" });
			}
		}
		const update = {};
		if (name) update.name = name;
		if (email) update.email = email.toLowerCase();
		const user = await User.findByIdAndUpdate(req.userId, update, {
			new: true,
			runValidators: true,
		});
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
		res.status(500).json({ error: "Failed to update profile" });
	}
});

router.put("/password", async (req, res) => {
	const { currentPassword, newPassword } = req.body;
	if (!currentPassword || !newPassword) {
		return res.status(400).json({ error: "Missing required fields" });
	}
	if (newPassword.length < 6) {
		return res
			.status(400)
			.json({ error: "Password must be at least 6 characters" });
	}
	try {
		const user = await User.findById(req.userId).select("+password");
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}
		const ok = await user.comparePassword(currentPassword);
		if (!ok) {
			return res
				.status(401)
				.json({ error: "Current password is incorrect" });
		}
		user.password = newPassword;
		await user.save();
		res.json({ success: "Password updated" });
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: "Failed to update password" });
	}
});

router.put("/theme", async (req, res) => {
	const { theme } = req.body;
	if (!["dark", "light"].includes(theme)) {
		return res.status(400).json({ error: "Invalid theme" });
	}
	try {
		const user = await User.findByIdAndUpdate(
			req.userId,
			{ theme },
			{ new: true },
		);
		res.json({ theme: user.theme });
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: "Failed to update theme" });
	}
});

router.delete("/threads", async (req, res) => {
	try {
		const result = await Thread.deleteMany({ userId: req.userId });
		res.json({ success: "Threads cleared", deletedCount: result.deletedCount });
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: "Failed to clear threads" });
	}
});

router.delete("/", async (req, res) => {
	try {
		await Thread.deleteMany({ userId: req.userId });
		await User.findByIdAndDelete(req.userId);
		res.clearCookie("token", COOKIE_OPTIONS);
		res.json({ success: "Account deleted" });
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: "Failed to delete account" });
	}
});

export default router;

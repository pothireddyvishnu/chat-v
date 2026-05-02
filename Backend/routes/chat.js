import express from "express";
import Thread from "../models/Thread.js";
import getGeminiAPIResponse from "../utils/gemini.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.use(auth);

// Threads
router.get("/thread", async (req, res) => {
	try {
		const threads = await Thread.find({ userId: req.userId }).sort({
			updatedAt: -1,
		});
		res.json(threads);
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: "Failed to fetch thread" });
	}
});

router.get("/thread/:threadId", async (req, res) => {
	const { threadId } = req.params;
	try {
		const thread = await Thread.findOne({ threadId, userId: req.userId });
		if (!thread) {
			return res.status(404).json({ error: "Thread not Found" });
		}
		res.json(thread.messages);
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: "Failed to fetch Chat" });
	}
});

router.delete("/thread/:threadId", async (req, res) => {
	const { threadId } = req.params;
	try {
		const deletedThread = await Thread.findOneAndDelete({
			threadId,
			userId: req.userId,
		});
		if (!deletedThread) {
			return res.status(404).json({ error: "Thread not found" });
		}
		res.status(200).json({ success: "Thread deleted Successfully" });
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: "Failed to delete thread" });
	}
});

router.post("/chat", async (req, res) => {
	const { threadId, message } = req.body;
	if (!threadId || !message) {
		return res.status(400).json({ error: "missing required fields" });
	}
	try {
		let thread = await Thread.findOne({ threadId, userId: req.userId });
		if (!thread) {
			thread = new Thread({
				userId: req.userId,
				threadId: threadId,
				title: message,
				messages: [{ role: "user", content: message }],
			});
		} else {
			thread.messages.push({ role: "user", content: message });
		}
		const assistantReply = await getGeminiAPIResponse(message);
		thread.messages.push({ role: "assistant", content: assistantReply });
		thread.updatedAt = new Date();
		await thread.save();
		res.json({ reply: assistantReply });
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: "Something went wrong" });
	}
});

export default router;

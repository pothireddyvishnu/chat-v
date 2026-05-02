import "dotenv/config";
import fetch from "node-fetch";

const getGeminiAPIResponse = async (message) => {
	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
		},
		body: JSON.stringify({
			model: "gemini-3-flash-preview",
			messages: [{ role: "user", content: message }],
		}),
	};
	try {
		const response = await fetch(
			"https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
			options,
		);
		const data = await response.json();
		if (!response.ok || !data?.choices?.[0]?.message?.content) {
			console.error(
				"Gemini API bad response:",
				response.status,
				JSON.stringify(data),
			);
			return "Sorry, I'm having trouble thinking right now.";
		}
		return data.choices[0].message.content;
	} catch (error) {
		console.error(error);
		return "Sorry, I'm having trouble thinking right now.";
	}
};
export default getGeminiAPIResponse;

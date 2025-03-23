const OPENAI_API_KEY = "YOUR_API_KEY";

export const analyzeEntry = async (
	content: string,
	mode: "summary" | "mood" | "advice"
): Promise<string> => {
	const prompts = {
		summary: "Summarize this journal entry.",
		mood: "Analyze and describe the mood and emotions in this journal entry.",
		advice: "Provide advice based on this journal entry.",
	};

	const response = await fetch("https://api.openai.com/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${OPENAI_API_KEY}`,
		},
		body: JSON.stringify({
			model: "gpt-3.5-turbo",
			messages: [
				{ role: "system", content: prompts[mode] },
				{ role: "user", content: content },
			],
			temperature: 0.7,
		}),
	});

	const data = await response.json();
	return data.choices[0].message.content;
};

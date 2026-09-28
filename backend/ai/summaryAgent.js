const groq = require("./groqClient");

async function generateSummary(meetingNotes) {
  try {
    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "system",
          content:
           "You are a meeting assistant. Generate only a concise professional meeting summary in 3-5 sentences. Do not include action items, task lists, headings, bullet points, or recommendations."
        },
        {
          role: "user",
          content: meetingNotes
        }
      ]
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Summary Error:", error.message);
    return null;
  }
}

module.exports = generateSummary;
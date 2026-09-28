const groq = require("./groqClient");

async function extractTasks(meetingNotes) {
  try {
    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "system",
          content: `
Extract action items from the meeting notes.

Return ONLY valid JSON.

Format:
[
  {
    "description": "",
    "owner": "",
    "dueDate": ""
  }
]

If information is missing, use "Not specified".
`
        },
        {
          role: "user",
          content: meetingNotes
        }
      ]
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Task Extraction Error:", error.message);
    return null;
  }
}

module.exports = extractTasks;
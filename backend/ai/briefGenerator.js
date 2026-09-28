const groq = require("./groqClient");

async function generateBrief(summary, tasks) {
  try {
    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "system",
          content:
            "Create a concise meeting brief using only the information provided. Include previous discussion, pending tasks, and focus areas for the next meeting. Do not invent dates, durations, names, or details that are not present in the input."
        },
        {
          role: "user",
          content: `
Summary:
${summary}

Tasks:
${tasks}
`
        }
      ]
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Brief Generation Error:", error.message);
    return null;
  }
}

module.exports = generateBrief;
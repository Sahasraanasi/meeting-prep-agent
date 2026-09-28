const groq = require("./groqClient");

async function testGroq() {
  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: "Say hello from Meeting Prep Agent",
        },
      ],
      model:"openai/gpt-oss-20b",
    });

    console.log(response.choices[0].message.content);
  } catch (error) {
    console.error("Groq Error:", error.message);
  }
}

testGroq();
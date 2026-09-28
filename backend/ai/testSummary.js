const generateSummary = require("./summaryAgent");

const notes = `
We discussed pricing options for the enterprise plan.
John will send a proposal by Friday.
The client requested a follow-up meeting next week.
Budget approval is pending.
`;

async function runTest() {
  const summary = await generateSummary(notes);

  console.log("\n=== SUMMARY ===\n");
  console.log(summary);
}

runTest();
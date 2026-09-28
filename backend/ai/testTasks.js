const extractTasks = require("./taskExtractor");

const notes = `
John will send the proposal by Friday.
Sarah will schedule a follow-up meeting next week.
Finance team will approve the budget.
`;

async function runTest() {
  const tasks = await extractTasks(notes);

  console.log("\n=== TASKS ===\n");
  console.log(tasks);
}

runTest();
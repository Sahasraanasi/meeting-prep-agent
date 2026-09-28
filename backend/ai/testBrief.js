const generateBrief = require("./briefGenerator");

const summary = `
The team discussed pricing options for the enterprise plan.
John will send a proposal by Friday.
Budget approval is pending.
`;

const tasks = `
[
  {
    "description": "send the proposal",
    "owner": "John",
    "dueDate": "Friday"
  },
  {
    "description": "approve the budget",
    "owner": "Finance team",
    "dueDate": "Not specified"
  }
]
`;

async function runTest() {
  const brief = await generateBrief(summary, tasks);

  console.log("\n=== MEETING BRIEF ===\n");
  console.log(brief);
}

runTest();
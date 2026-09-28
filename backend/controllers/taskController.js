// In-memory storage for tasks
let tasks = [
  {
    id: 1,
    title: "Send follow-up email",
    description: "Send meeting notes and action items to Alex",
    status: "Pending",
    dueDate: "2026-10-07",
    contactId: 1
  }
];

// GET /tasks - Fetch all tasks
exports.getTasks = (req, res) => {
  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks
  });
};

// POST /tasks - Create a new task
exports.createTask = (req, res) => {
  const { title, description, status, dueDate, contactId } = req.body;

  if (!title) {
    return res.status(400).json({
      success: false,
      message: "Title is required."
    });
  }

  const newTask = {
    id: tasks.length + 1,
    title,
    description: description || "",
    status: status || "Pending",
    dueDate: dueDate || "",
    contactId: contactId || null
  };

  tasks.push(newTask);

  res.status(201).json({
    success: true,
    message: "Task created successfully",
    data: newTask
  });
};
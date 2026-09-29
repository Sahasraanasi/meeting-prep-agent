const Task = require('../models/Task');

// GET /tasks - Fetch only tasks belonging to the authenticated user
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      userId: req.user.id
    });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// POST /tasks - Create a task for the authenticated user
exports.createTask = async (req, res) => {
  try {
    const { description, status, dueDate } = req.body;

    if (!description) {
      return res.status(400).json({
        success: false,
        message: "Description is required."
      });
    }

    const newTask = await Task.create({
      description,
      status: status || "Pending",
      dueDate: dueDate || null,
      userId: req.user.id
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: newTask
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// PUT /tasks/:id - Update only a task belonging to the authenticated user
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found or access denied."
      });
    }

    const { description, status, dueDate } = req.body;

    task.description = description !== undefined ? description : task.description;
    task.status = status !== undefined ? status : task.status;
    task.dueDate = dueDate !== undefined ? dueDate : task.dueDate;

    const updatedTask = await task.save();

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: updatedTask
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE /tasks/:id - Delete only a task belonging to the authenticated user
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found or access denied."
      });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

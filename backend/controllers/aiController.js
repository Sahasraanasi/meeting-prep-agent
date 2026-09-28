const { generateSummary } = require('../ai/summaryAgent');
const { extractTasks } = require('../ai/taskExtractor');
const { generateBrief } = require('../ai/briefGenerator');

// POST /ai/summary
exports.getSummary = async (req, res) => {
  try {
    const { notes } = req.body;

    if (!notes) {
      return res.status(400).json({
        success: false,
        message: 'Meeting notes are required'
      });
    }

    const summary = await generateSummary(notes);

    res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// POST /ai/tasks
exports.getTasks = async (req, res) => {
  try {
    const { notes } = req.body;

    if (!notes) {
      return res.status(400).json({
        success: false,
        message: 'Meeting notes are required'
      });
    }

    const tasks = await extractTasks(notes);

    res.status(200).json({
      success: true,
      data: tasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// POST /ai/brief
exports.getBrief = async (req, res) => {
  try {
    const { summary, tasks } = req.body;

    if (!summary || !tasks) {
      return res.status(400).json({
        success: false,
        message: 'Summary and tasks are required'
      });
    }

    const brief = await generateBrief(summary, tasks);

    res.status(200).json({
      success: true,
      data: brief
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
const Meeting = require('../models/Meeting');

// GET /meetings - Fetch only meetings belonging to the authenticated user
exports.getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find({
      userId: req.user.id
    });

    res.status(200).json({
      success: true,
      count: meetings.length,
      data: meetings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// POST /meetings - Create a meeting for the authenticated user
exports.createMeeting = async (req, res) => {
  try {
    const { title, date, contactId, notes, summary } = req.body;

    if (!title || !date) {
      return res.status(400).json({
        success: false,
        message: "Title and date are required fields."
      });
    }

    const newMeeting = await Meeting.create({
      title,
      date,
      contactId: contactId || null,
      notes: notes || "",
      summary: summary || "",
      userId: req.user.id
    });

    res.status(201).json({
      success: true,
      message: "Meeting created successfully",
      data: newMeeting
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// PUT /meetings/:id - Update only a meeting belonging to the authenticated user
exports.updateMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found or access denied."
      });
    }

    const { title, date, contactId, notes, summary } = req.body;

    meeting.title = title !== undefined ? title : meeting.title;
    meeting.date = date !== undefined ? date : meeting.date;
    meeting.contactId = contactId !== undefined ? contactId : meeting.contactId;
    meeting.notes = notes !== undefined ? notes : meeting.notes;
    meeting.summary = summary !== undefined ? summary : meeting.summary;

    const updatedMeeting = await meeting.save();

    res.status(200).json({
      success: true,
      message: "Meeting updated successfully",
      data: updatedMeeting
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE /meetings/:id - Delete only a meeting belonging to the authenticated user
exports.deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found or access denied."
      });
    }

    res.status(200).json({
      success: true,
      message: "Meeting deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

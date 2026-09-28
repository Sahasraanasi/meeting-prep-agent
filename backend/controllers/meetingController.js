// In-memory storage for meetings
let meetings = [
  {
    id: 1,
    title: "Q3 Strategy Alignment",
    date: "2026-10-05T10:00:00Z",
    contactId: 1,
    notes: "Discussed roadmap priorities and deliverables.",
    summary: "Reviewed upcoming milestones and aligned on deliverables."
  }
];

// GET /meetings - Fetch all meetings
exports.getMeetings = (req, res) => {
  res.status(200).json({
    success: true,
    count: meetings.length,
    data: meetings
  });
};

// POST /meetings - Create a new meeting
exports.createMeeting = (req, res) => {
  const { title, date, contactId, notes, summary } = req.body;

  if (!title || !date) {
    return res.status(400).json({
      success: false,
      message: "Title and date are required fields."
    });
  }

  const newMeeting = {
    id: meetings.length + 1,
    title,
    date,
    contactId: contactId || null,
    notes: notes || "",
    summary: summary || ""
  };

  meetings.push(newMeeting);

  res.status(201).json({
    success: true,
    message: "Meeting created successfully",
    data: newMeeting
  });
};
// In-memory storage for contacts
let contacts = [
  {
    id: 1,
    name: "Alex Johnson",
    company: "Acme Corp",
    jobTitle: "Product Manager",
    email: "alex@acme.com",
    phone: "123-456-7890"
  }
];

// GET /contacts - Fetch all contacts
exports.getContacts = (req, res) => {
  res.status(200).json({
    success: true,
    count: contacts.length,
    data: contacts
  });
};

// POST /contacts - Add a new contact
exports.createContact = (req, res) => {
  const { name, company, jobTitle, email, phone } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message: "Name and email are required fields."
    });
  }

  const newContact = {
    id: contacts.length + 1,
    name,
    company: company || "",
    jobTitle: jobTitle || "",
    email,
    phone: phone || ""
  };

  contacts.push(newContact);

  res.status(201).json({
    success: true,
    message: "Contact added successfully",
    data: newContact
  });
};
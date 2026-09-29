const Contact = require('../models/Contact');

// GET /contacts - Fetch only contacts belonging to the authenticated user
exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({
      userId: req.user.id
    });

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// POST /contacts - Create a contact for the authenticated user
exports.createContact = async (req, res) => {
  try {
    const { name, company, jobTitle, email, phone } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required fields."
      });
    }

    const newContact = await Contact.create({
      name,
      company: company || "",
      jobTitle: jobTitle || "",
      email,
      phone: phone || "",
      userId: req.user.id
    });

    res.status(201).json({
      success: true,
      message: "Contact added successfully",
      data: newContact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// PUT /contacts/:id - Update only a contact belonging to the authenticated user
exports.updateContact = async (req, res) => {
  try {
    const contact = await Contact.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found or access denied."
      });
    }

    const { name, company, jobTitle, email, phone } = req.body;

    contact.name = name !== undefined ? name : contact.name;
    contact.company = company !== undefined ? company : contact.company;
    contact.jobTitle = jobTitle !== undefined ? jobTitle : contact.jobTitle;
    contact.email = email !== undefined ? email : contact.email;
    contact.phone = phone !== undefined ? phone : contact.phone;

    const updatedContact = await contact.save();

    res.status(200).json({
      success: true,
      message: "Contact updated successfully",
      data: updatedContact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE /contacts/:id - Delete only a contact belonging to the authenticated user
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found or access denied."
      });
    }

    res.status(200).json({
      success: true,
      message: "Contact deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

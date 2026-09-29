const bcrypt = require('bcryptjs');

// In-memory user store until MongoDB Atlas is connected
const users = [];

// POST /auth/register
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, and password are required.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    const cleanUsername = username.trim().toLowerCase();
    const cleanEmail = email.trim().toLowerCase();

    // Check unique username
    const existingUsername = users.find(u => u.username === cleanUsername);
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: 'Username is already taken.'
      });
    }

    // Check unique email
    const existingEmail = users.find(u => u.email === cleanEmail);
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email is already registered.'
      });
    }

    // Hash password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      id: users.length + 1,
      username: cleanUsername,
      email: cleanEmail,
      password: hashedPassword,
      createdAt: new Date()
    };

    users.push(newUser);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
};

// Export user store for subsequent login controller implementation
exports.users = users;
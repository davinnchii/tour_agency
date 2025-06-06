require('../models/Subscription');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// Реєстрація
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const user = await User.create({ name, email, password, role });

    res.status(201).json({
      token: generateToken(user),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        subscriptions: user.subscriptions || [] // Нове поле
      }
    });
  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Логін
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).populate('subscriptions', 'name email');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      token: generateToken(user),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        subscriptions: user.subscriptions || [] // Нове поле
      }
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

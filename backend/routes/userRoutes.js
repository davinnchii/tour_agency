const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');

router.route('/operators')
.get(protect, async (req, res) => {
    try {
      const operators = await User.find({ role: 'operator' }).select('name email');
      res.json(operators);
    } catch (err) {
      res.status(500).json({ message: 'Помилка при отриманні операторів' });
    }
  });
  
  module.exports = router;
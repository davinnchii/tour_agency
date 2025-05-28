const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const {
  createTour,
  getTours,
  deleteTour,
} = require('../controllers/tourController');

router.route('/')
  .get(protect, getTours)          // Перегляд турів будь-яким авторизованим користувачем
  .post(protect, authorizeRoles('operator'), createTour); // Додавання — лише оператор

router.route('/:id')
  .delete(protect, authorizeRoles('operator'), deleteTour);

module.exports = router;

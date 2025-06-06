const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getRequests,
  getRequestById,
  createRequest,
  deleteRequest,
} = require('../controllers/requestController');

router.route('/')
  .get(protect, getRequests)
  .post(protect, createRequest);

router.route('/:id')
  .get(protect, getRequestById)
  .delete(protect, deleteRequest);

module.exports = router;

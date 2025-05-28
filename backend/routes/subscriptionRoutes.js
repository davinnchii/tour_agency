const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const {
    createSubscription,
    getSubscriptions,
    deleteSubscription
} = require('../controllers/subscriptionController');

router.post('/', protect, authorizeRoles('agent'), createSubscription);
router.get('/', protect, authorizeRoles('agent'), getSubscriptions);
router.delete('/:id', protect, authorizeRoles('agent'), deleteSubscription);

module.exports = router;

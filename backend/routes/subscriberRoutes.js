const router = require('express').Router();
const { subscribe, getSubscribers } = require('../controllers/subscriberController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', subscribe);
router.get('/', protect, admin, getSubscribers);

module.exports = router;

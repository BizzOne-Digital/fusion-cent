const router = require('express').Router();
const { createCheckoutSession, verifySession } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create-checkout-session', protect, createCheckoutSession);
router.get('/verify/:sessionId', protect, verifySession);

module.exports = router;

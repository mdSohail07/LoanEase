const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updateUserProfile, getUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.get('/profile/credit-score', protect, require('../controllers/authController').calculateCreditScore);

module.exports = router;

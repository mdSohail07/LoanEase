const express = require('express');
const router = express.Router();
const { getPendingKYCs, verifyKYC, getAdminStats, getAllUsers } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect);
router.use(admin);

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.get('/kyc/pending', getPendingKYCs);
router.put('/kyc/verify', verifyKYC);
router.get('/repayment-progress', require('../controllers/adminController').calculateRepaymentProgress);

module.exports = router;

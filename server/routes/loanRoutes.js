const express = require('express');
const router = express.Router();
const { applyLoan, getLoans, updateLoanStatus } = require('../controllers/loanController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, applyLoan)
    .get(protect, getLoans);

router.put('/:id', protect, admin, updateLoanStatus);
router.put('/:id/disburse', protect, admin, require('../controllers/loanController').disburseLoan);
router.put('/:id/accept-offer', protect, require('../controllers/loanController').acceptOffer);
router.post('/:id/pay', protect, require('../controllers/loanController').payEMI);

module.exports = router;

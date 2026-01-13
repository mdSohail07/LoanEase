const express = require('express');
const router = express.Router();
const { applyLoan, getLoans, updateLoanStatus } = require('../controllers/loanController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, applyLoan)
    .get(protect, getLoans);

router.route('/:id')
    .put(protect, admin, updateLoanStatus);

module.exports = router;

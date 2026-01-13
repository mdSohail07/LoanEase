const express = require('express');
const router = express.Router();
const { getOffers, createOffer, deleteOffer } = require('../controllers/offerController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getOffers)
    .post(protect, admin, createOffer);

router.route('/:id')
    .delete(protect, admin, deleteOffer);

module.exports = router;

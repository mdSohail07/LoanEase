const Offer = require('../models/Offer');

exports.getOffers = async (req, res) => {
    try {
        const offers = await Offer.find({});
        res.json(offers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createOffer = async (req, res) => {
    const { title, minAmount, maxAmount, interestRate, tenure, description } = req.body;

    try {
        const offer = await Offer.create({
            title,
            minAmount,
            maxAmount,
            interestRate,
            tenure,
            description
        });
        res.status(201).json(offer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteOffer = async (req, res) => {
    try {
        const offer = await Offer.findByIdAndDelete(req.params.id);
        if (offer) {
            res.json({ message: 'Offer removed' });
        } else {
            res.status(404).json({ message: 'Offer not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

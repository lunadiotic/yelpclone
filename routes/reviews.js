const express = require('express')
const wrapAsync = require('../utils/wrapAsync');
const Place = require('../models/place');
const Review = require('../models/review');
const isValidObjectId = require('../middlewares/isValidObjectId');
const isAuth = require('../middlewares/isAuth');
const validateReview = require('../middlewares/validateReview');
const router = express.Router({ mergeParams: true });

router.post('/', isAuth, isValidObjectId('/places'), validateReview, wrapAsync(async (req, res) => {
    const { place_id } = req.params;

    const review = new Review(req.body.review);
    review.author = req.user._id

    const place = await Place.findById(place_id);
    place.reviews.push(review);

    await review.save();
    await place.save();

    req.flash('success_msg', 'Review Created!');
    res.redirect(`/places/${place_id}`);
}))

router.delete('/:review_id', isAuth, isValidObjectId('/places'), wrapAsync(async (req, res) => {
    const { place_id, review_id } = req.params;
    await Place.findByIdAndUpdate(place_id, { $pull: { reviews: review_id } });
    await Review.findByIdAndDelete(review_id);
    req.flash('success_msg', 'Review Deleted!');
    res.redirect(`/places/${place_id}`);
}))

module.exports = router;
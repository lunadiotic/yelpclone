const Place = require("../models/place");
const Review = require("../models/review");

module.exports.isAuthorPlace = async (req, res, next) => {
    const { id } = req.params;
    const place = await Place.findById(id);

    if (!place.author.equals(req.user._id)) {
        req.flash('error_msg', 'Not Authorized!');
        return res.redirect(`/places/${id}`);
    }
    next();
}

module.exports.isAuthorReview = async (req, res, next) => {
    const { place_id, review_id } = req.params;
    const place = await Review.findById(review_id);

    if (!place.author.equals(req.user._id)) {
        req.flash('error_msg', 'Not Authorized!');
        return res.redirect(`/places/${place_id}`);
    }
    next();
}
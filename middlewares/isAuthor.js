const Place = require("../models/place");

module.exports = async (req, res, next) => {
    const { id } = req.params;
    const place = await Place.findById(id);
    if (!req.user._id) {
        req.flash('error_msg', 'Not Authorized!');
        return res.redirect(`/places/${id}`);
    }

    if (!place.author.equals(req.user._id)) {
        req.flash('error_msg', 'Not Authorized!');
        return res.redirect(`/places/${id}`);
    }
    next();
}
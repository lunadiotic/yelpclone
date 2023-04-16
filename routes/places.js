const express = require('express')
const wrapAsync = require('../utils/wrapAsync');
const Place = require('../models/place');
const { placeSchema } = require('../schemas/place');
const ExpressError = require('../utils/ExpressError');
const isValidObjectId = require('../middleware/isValidObjectId');
const router = express.Router();

const validatePlace = (req, res, next) => {
    const { error } = placeSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        return next(new ExpressError(msg, 400))
    } else {
        next();
    }
}

router.get('/', wrapAsync(async (req, res) => {
    const places = await Place.find();
    res.render('places/index', { places });
}))

router.get('/create', (req, res) => {
    res.render('places/create');
})

router.post('/', validatePlace, wrapAsync(async (req, res, next) => {
    const place = new Place(req.body.place);
    await place.save();
    req.flash('success_msg', 'Place Created!');
    res.redirect('/places');
}))

router.get('/:id', isValidObjectId('/places'), wrapAsync(async (req, res) => {
    const place = await Place.findById(req.params.id).populate('reviews');
    res.render('places/show', { place });
}))

router.get('/:id/edit', isValidObjectId('/places'), wrapAsync(async (req, res) => {
    const place = await Place.findById(req.params.id);
    res.render('places/edit', { place });
}))

router.put('/:id', isValidObjectId('/places'), validatePlace, wrapAsync(async (req, res) => {
    await Place.findByIdAndUpdate(req.params.id, { ...req.body.place });
    req.flash('success_msg', 'Place Updated!');
    res.redirect('/places');
}))

router.delete('/:id', isValidObjectId('/places'), wrapAsync(async (req, res) => {
    await Place.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Place Deleted!');
    res.redirect('/places');
}))

module.exports = router;
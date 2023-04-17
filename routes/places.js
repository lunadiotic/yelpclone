const express = require('express')
const wrapAsync = require('../utils/wrapAsync');
const Place = require('../models/place');
const isValidObjectId = require('../middlewares/isValidObjectId');
const isAuth = require('../middlewares/isAuth');
const validatePlace = require('../middlewares/validatePlace');
const { isAuthorPlace } = require('../middlewares/isAuthor');
const router = express.Router();





router.get('/', wrapAsync(async (req, res) => {
    const places = await Place.find();
    res.render('places/index', { places });
}))

router.get('/create', isAuth, (req, res) => {
    res.render('places/create');
})

router.post('/', isAuth, validatePlace, wrapAsync(async (req, res, next) => {
    const place = new Place(req.body.place);
    place.author = req.user._id
    await place.save();
    req.flash('success_msg', 'Place Created!');
    res.redirect('/places');
}))

router.get('/:id', isValidObjectId('/places'), wrapAsync(async (req, res) => {
    const place = await Place.findById(req.params.id)
        .populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        })
        .populate('author');
    console.log(place)
    res.render('places/show', { place });
}))

router.get('/:id/edit', isAuth, isAuthorPlace, isValidObjectId('/places'), wrapAsync(async (req, res) => {
    const place = await Place.findById(req.params.id);
    res.render('places/edit', { place });
}))

router.put('/:id', isAuth, isAuthorPlace, isValidObjectId('/places'), validatePlace, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const place = await Place.findByIdAndUpdate(id, { ...req.body.place });
    req.flash('success_msg', 'Place Updated!');
    res.redirect(`/places/${place._id}`);
}))

router.delete('/:id', isAuth, isAuthorPlace, isValidObjectId('/places'), wrapAsync(async (req, res) => {
    await Place.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Place Deleted!');
    res.redirect('/places');
}))

module.exports = router;
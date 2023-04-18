const express = require('express')
const wrapAsync = require('../utils/wrapAsync');
const Place = require('../models/place');
const PlaceController = require('../controllers/places')
const isValidObjectId = require('../middlewares/isValidObjectId');
const isAuth = require('../middlewares/isAuth');
const validatePlace = require('../middlewares/validatePlace');
const { isAuthorPlace } = require('../middlewares/isAuthor');
const router = express.Router();





router.get('/', wrapAsync(PlaceController.index))

router.get('/create', isAuth, PlaceController.create)

router.post('/', isAuth, validatePlace, wrapAsync(PlaceController.store))

router.get('/:id', isValidObjectId('/places'), wrapAsync(PlaceController.show))

router.get('/:id/edit', isAuth, isAuthorPlace, isValidObjectId('/places'), wrapAsync(PlaceController.edit))

router.put('/:id', isAuth, isAuthorPlace, isValidObjectId('/places'), validatePlace, wrapAsync(PlaceController.update))

router.delete('/:id', isAuth, isAuthorPlace, isValidObjectId('/places'), wrapAsync(PlaceController.destroy))

module.exports = router;
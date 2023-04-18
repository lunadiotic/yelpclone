const express = require('express')
const wrapAsync = require('../utils/wrapAsync');
const PlaceController = require('../controllers/places')
const isValidObjectId = require('../middlewares/isValidObjectId');
const isAuth = require('../middlewares/isAuth');
const validatePlace = require('../middlewares/validatePlace');
const { isAuthorPlace } = require('../middlewares/isAuthor');
const upload = require('../configs/multer');
const router = express.Router();

router.route('/')
    .get(wrapAsync(PlaceController.index))
    .post(isAuth, upload.array('image', 5), validatePlace, wrapAsync(PlaceController.store))

router.get('/create', isAuth, PlaceController.create)

router.route('/:id')
    .get(isValidObjectId('/places'), wrapAsync(PlaceController.show))
    .put(isAuth, isAuthorPlace, isValidObjectId('/places'), validatePlace, wrapAsync(PlaceController.update))
    .delete(isAuth, isAuthorPlace, isValidObjectId('/places'), wrapAsync(PlaceController.destroy))

router.get('/:id/edit', isAuth, isAuthorPlace, isValidObjectId('/places'), wrapAsync(PlaceController.edit))

module.exports = router;
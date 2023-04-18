const express = require('express')
const wrapAsync = require('../utils/wrapAsync');
const Place = require('../models/place');
const Review = require('../models/review');
const ReviewController = require('../controllers/reviews');
const isValidObjectId = require('../middlewares/isValidObjectId');
const isAuth = require('../middlewares/isAuth');
const validateReview = require('../middlewares/validateReview');
const { isAuthorReview } = require('../middlewares/isAuthor');
const router = express.Router({ mergeParams: true });

router.post('/', isAuth, isValidObjectId('/places'), validateReview, wrapAsync(ReviewController.store))

router.delete('/:review_id', isAuth, isAuthorReview, isValidObjectId('/places'), wrapAsync(ReviewController.destroy))

module.exports = router;
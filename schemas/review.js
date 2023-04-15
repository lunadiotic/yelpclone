const Joi = require('joi')

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().min(1).required(),
        body: Joi.string().required(),
    }).required()
})

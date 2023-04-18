const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Review = require('./review')

const placeSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    images: [{
        type: String
    }],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})

placeSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Place', placeSchema)
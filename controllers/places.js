const Place = require("../models/place");
const fs = require('fs');

module.exports.index = async (req, res) => {
    const places = await Place.find();
    res.render('places/index', { places });
}

module.exports.create = (req, res) => {
    res.render('places/create');
}

module.exports.store = async (req, res, next) => {
    const images = req.files.map(file => ({ url: file.path, filename: file.filename }));
    const place = new Place(req.body.place);
    place.author = req.user._id
    place.images = images;
    await place.save();
    req.flash('success_msg', 'Place Created!');
    res.redirect('/places');
}


module.exports.show = async (req, res) => {
    const place = await Place.findById(req.params.id)
        .populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        })
        .populate('author');
    res.render('places/show', { place });
}

module.exports.edit = async (req, res) => {
    const place = await Place.findById(req.params.id);
    res.render('places/edit', { place });
}

module.exports.update = async (req, res) => {
    const { id } = req.params;
    const place = await Place.findByIdAndUpdate(id, { ...req.body.place });

    if (req.files && req.files.length > 0) {
        place.images.forEach(image => {
            fs.unlinkSync(image.url);
        });

        const images = req.files.map(file => ({ url: file.path, filename: file.filename }));
        place.images = images
        await place.save();
    }

    req.flash('success_msg', 'Place Updated!');
    res.redirect(`/places/${place._id}`);
}

module.exports.destroy = async (req, res) => {
    await Place.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Place Deleted!');
    res.redirect('/places');
}
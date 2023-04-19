const Place = require("../models/place");
const fs = require('fs');
const hereMaps = require('../utils/hereMaps');

module.exports.index = async (req, res) => {
    const places = await Place.find();
    res.render('places/index', { places });
}

module.exports.create = (req, res) => {
    res.render('places/create');
}

module.exports.store = async (req, res, next) => {
    const images = req.files.map(file => ({ url: file.path, filename: file.filename }));
    const geoData = await hereMaps.geometry(req.body.place.location);

    const place = new Place(req.body.place);
    place.author = req.user._id
    place.images = images;
    place.geometry = geoData

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
    const { id } = req.params
    const place = await Place.findById(id);

    if (place.images.length > 0) {
        place.images.forEach(image => {
            fs.unlinkSync(image.url);
        });
    }

    await Place.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Place Deleted!');
    res.redirect('/places');
}

module.exports.destroyImages = async (req, res) => {
    try {
        const { id } = req.params
        const { images } = req.body

        // Cek apakah model Place ditemukan berdasarkan ID-nya
        const place = await Place.findById(id);
        if (!place) {
            req.flash('error_msg', 'Place not found');
            return res.redirect(`/places/${id}/edit`);
        }

        if (!images || images.length === 0) {
            req.flash('error_msg', 'Please select at least one image');
            return res.redirect(`/places/${id}/edit`);
        }

        // Hapus file gambar dari sistem file
        images.forEach(image => {
            fs.unlinkSync(image);
        });

        // Hapus data gambar dari model Place
        await Place.findByIdAndUpdate(
            id,
            { $pull: { images: { url: { $in: images } } } },
            { new: true }
        );

        req.flash('success_msg', 'Successfully deleted images');
        return res.redirect(`/places/${id}/edit`);
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Failed to delete images');
        return res.redirect(`/places/${id}/edit`);
    }
}
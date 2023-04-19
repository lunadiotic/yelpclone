const ExpressError = require("./ExpressError");
const baseUrl = 'https://geocode.search.hereapi.com/v1'
const apiKey = 'cKKA1D0ftrVJs4QkN-6rCiVWIOiCgsvi3UEVAjhWqAs'

module.exports.geocode = async (address) => {
    const url = `${baseUrl}/geocode?q=${address}&apiKey=${apiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        const lat = data.items[0].position.lat;
        const lng = data.items[0].position.lng;
        return { lat, lng }
    } catch (err) {
        new ExpressError(err.message, 500)
    }
}
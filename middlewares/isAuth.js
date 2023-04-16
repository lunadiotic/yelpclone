module.exports = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error_msg', 'You are not logged in');
        res.redirect('/login');
    }
    next();
}
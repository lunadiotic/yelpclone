const User = require('../models/user');

module.exports.register = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registerUser = await User.register(user, password);
        req.login(registerUser, err => {
            if (err) return next(err);
            req.flash('success_msg', 'You are now registered and logged in');
            res.redirect('/places');
        })
    } catch (error) {
        req.flash('error_msg', error.message);
        res.redirect('/register');
    }
}

module.exports.loginForm = (req, res) => {
    res.render('auth/login');
}

module.exports.login = (req, res) => {
    req.flash('success_msg', 'You are now logged in');
    res.redirect('/places');
}

module.exports.logout = (req, res) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.flash('success_msg', 'You are now logged out');
        res.redirect('/places');
    });
}
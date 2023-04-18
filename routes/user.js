const express = require('express');
const router = express.Router();
const User = require('../models/user');
const AuthController = require('../controllers/auth')
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');

router.route('/register')
    .get((req, res) => {
        res.render('auth/register');
    })
    .post(wrapAsync(AuthController.register))

router.route('/login')
    .get(AuthController.loginForm)
    .post(passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: {
            type: 'error_msg',
            msg: 'Invalid username or password'
        }
    }), AuthController.login)

router.post('/logout', AuthController.logout)


module.exports = router;
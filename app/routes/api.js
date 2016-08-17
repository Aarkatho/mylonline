var express = require('express');
var validator = require('validator');
var _ = require('underscore');
var jwt = require('jsonwebtoken');

var User = require('../models/user');

var router = express.Router();

router.post('/user', function (req, res) {
    var uname = req.body.username.toLowerCase();
    var uemail = req.body.email.toLowerCase();
    var validationErrors = {};

    !validator.isAlphanumeric(uname) || !validator.isLength(uname, {min: 4, max: 16}) ?
        validationErrors.usernameError = true : validationErrors.usernameError = false;

    !validator.isAlphanumeric(req.body.password) || !validator.isLength(req.body.password, {min: 8, max: 16}) ?
        validationErrors.passwordError = true : validationErrors.passwordError = false;

    !validator.equals(req.body.password, req.body.rpassword) ?
        validationErrors.rpasswordError = true : validationErrors.rpasswordError = false;

    !validator.isEmail(uemail) ?
        validationErrors.emailError = true : validationErrors.emailError = false;

    if (_.contains(validationErrors, true)) {
        res.json({
            success: false,
            errorType: 'validation',
            validationErrors: validationErrors
        });
    } else {
        User.find({$or: [{username: uname}, {email: uemail}]}, function (err, users) {
            if (err) throw err;

            var usernameExists;
            var emailExists;
            _.findWhere(users, {username: uname}) ? usernameExists = true : usernameExists = false;
            _.findWhere(users, {email: uemail}) ? emailExists = true : emailExists = false;

            if (usernameExists || emailExists) {
                res.json({
                    success: false,
                    errorType: 'not available',
                    usernameExists: usernameExists,
                    emailExists: emailExists
                });
            } else {
                var usr = new User({
                    username: uname,
                    password: req.body.password,
                    email: uemail
                });

                usr.save(function (err) {
                    if (err) throw err;

                    res.json({success: true});
                });
            }
        });
    }
});

router.put('/user', function (req, res) {});

router.post('/user/auth/token', function (req, res) {
    User.findOne({email: req.body.email}, function (err, user) {
        if (err) throw err;

        if (user) {
            if (req.body.password != user.password) {
                res.json({
                    success: false,
                    message: 'Contraseña incorrecta'
                });
            } else {
                var token = jwt.sign({name: user.name}, req.app.get('secret key'), {expiresIn: '30s'});

                res.json({
                    success: true,
                    message: 'Has iniciado sesión correctamente',
                    token: token
                });
            }
        } else {
            res.json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
    });
});

router.post('/user/auth/facebook', function (req, res) {});

router.get('/user/:name', function (req, res) {
    User.findOne({name: req.params.name}, function (err, user) {
        if (err) throw err;

        if (user) {
            res.json({
                success: true,
                message: 'Usuario encontrado',
                user: user
            });
        } else {
            res.json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
    });
});

// TESTS

router.get('/users', function (req, res) {
    User.find({}, function (err, users) {
        if(err) throw err;

        res.json(users);
    });
});

module.exports = router;

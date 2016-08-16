var express = require('express');
var validator = require('validator');
var _ = require('underscore');
var jwt = require('jsonwebtoken');

var User = require('../models/user');

var router = express.Router();

router.post('/user', function (req, res) {
    var validationErrors = {};

    if (!validator.isAlphanumeric(req.body.username) || !validator.isLength(req.body.username, {min: 4, max: 16})) {
        validationErrors.usernameError = true;
    }

    if (!validator.isAlphanumeric(req.body.password) || !validator.isLength(req.body.password, {min: 8, max: 16})) {
        validationErrors.passwordError = true;
    }

    if (!validator.equals(req.body.password, req.body.rpassword)) validationErrors.rpasswordError = true;

    if (!validator.isEmail(req.body.email)) validationErrors.emailError = true;

    if (_.isEmpty(validationErrors)) {
        User.find({$or: [{password: req.body.password}, {email: req.body.email}]}, function (err, users) {
            if (err) throw err;

            var usernameExists;
            var emailExists;
            _.findWhere(users, {username: req.body.username}) ? usernameExists = true : usernameExists = false;
            _.findWhere(users, {email: req.body.email}) ? emailExists = true : emailExists = false;

            if (usernameExists || emailExists) {
                res.json({success: false, usernameExists: usernameExists, emailExists: emailExists});
            } else {
                var usr = new User({
                    username: req.body.username,
                    password: req.body.password,
                    email: req.body.email
                });

                usr.save(function (err) {
                    if (err) throw err;

                    res.json({success: true});
                });
            }
        });
    } else {
        res.json({success: false, validationErrors: validationErrors});
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

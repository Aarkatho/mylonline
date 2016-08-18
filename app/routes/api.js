var express = require('express');
var validator = require('validator');
var _ = require('underscore');
var jwt = require('jsonwebtoken');

var User = require('../models/user');

var router = express.Router();

router.post('/user', function (req, res) {
    var usernameValidationError;
    var passwordValidationError;
    var rpasswordValidationError;
    var emailValidationError;

    !validator.isAlphanumeric(req.body.username) || !validator.isLength(req.body.username, {min: 4, max: 16}) ?
        usernameValidationError = true : usernameValidationError = false;

    !validator.isAlphanumeric(req.body.password) || !validator.isLength(req.body.password, {min: 8, max: 16}) ?
        passwordValidationError = true : passwordValidationError = false;

    !validator.equals(req.body.password, req.body.rpassword) ?
        rpasswordValidationError = true : rpasswordValidationError = false;

    !validator.isEmail(req.body.email) ?
        emailValidationError = true : emailValidationError = false;

    if (usernameValidationError || passwordValidationError || rpasswordValidationError || emailValidationError) {
        res.status(400).json({
            errorType: 'validation',
            errors: {
                usernameValidationError: usernameValidationError,
                passwordValidationError: passwordValidationError,
                rpasswordValidationError: rpasswordValidationError,
                emailValidationError: emailValidationError
            }
        });
    } else {
        var lowerCaseUsername = req.body.username.toLowerCase();
        var lowerCaseEmail = req.body.email.toLowerCase();

        User.find({$or: [{username: lowerCaseUsername}, {email: lowerCaseEmail}]}, function (err, users) {
            if (err) throw err;

            var usernameExists;
            var emailExists;
            _.findWhere(users, {username: lowerCaseUsername}) ? usernameExists = true : usernameExists = false;
            _.findWhere(users, {email: lowerCaseEmail}) ? emailExists = true : emailExists = false;

            if (usernameExists || emailExists) {
                res.status(400).json({
                    errorType: 'availability',
                    erros: {
                        usernameExists: usernameExists,
                        emailExists: emailExists
                    }
                });
            } else {
                var usr = new User({
                    username: lowerCaseUsername,
                    password: req.body.password,
                    email: lowerCaseEmail
                });

                usr.save(function (err) {
                    if (err) throw err;

                    res.sendStatus(200);
                });
            }
        });
    }
});

router.put('/user', function (req, res) {});

router.post('/user/auth/token', function (req, res) {
    var lowerCaseUsername = req.body.username.toLowerCase();

    User.findOne({username: lowerCaseUsername}, function (err, user) {
        if (err) throw err;

        if (user) {
            if (req.body.password === user.password) {
                var token = jwt.sign({username: lowerCaseUsername}, req.app.get('secret key'), {expiresIn: '90m'});
                res.status(200).json({token: token});
            } else res.sendStatus(400);
        } else res.sendStatus(400);
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

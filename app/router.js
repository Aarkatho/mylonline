var express = require('express');
var validator = require('validator');
var _ = require('underscore');

var User = require('./models/user');

var router = express.Router();

router.get('/', function (req, res) {
    res.render('index', {});
});

router.post('/user', function (req, res) {
    var usernameValidationError;
    var passwordValidationError;
    var rpasswordValidationError;
    var emailValidationError;

    !validator.isAlphanumeric(req.body.username) || !validator.isLength(req.body.username, {min: 4, max: 16}) ?
        usernameValidationError = true : usernameValidationError = false;

    !validator.isAlphanumeric(req.body.password) || !validator.isLength(req.body.password, {min: 3, max: 16}) ?
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

router.post('/login', function (req, res) {
    var lowerCaseUsername = req.body.username.toLowerCase();

    User.findOne({username: lowerCaseUsername}, function (err, user) {
        if (err) throw err;

        if (user) {
            if (req.body.password === user.password) {
                req.session.username = lowerCaseUsername;
                req.session.isAdmin = user.isAdmin;
                req.session.isBanned = user.isBanned;
                res.status(200).json(user.userId);
            } else res.sendStatus(400);
        } else res.sendStatus(404);
    });
});

var isLoggedIn = function (req, res, next) {
    if (req.session && !req.session.isBanned) next();
    else return res.sendStatus(401);
};

router.get('/user/:userId', isLoggedIn, function (req, res) {
    if (validator.isInt(req.params.userId, {min: 1})) {
        User.findOne({userId: req.params.userId}, function (err, user) {
            if (err) throw err;

            if (user) {
                var data = {
                    username: user.username,
                    email: user.email
                };

                if (req.session.username === user.username) {
                    _.extend(data, {
                        isAdmin: user.isAdmin,
                        isBanned: user.isBanned
                    });
                }

                res.status(200).json(data);
            } else res.sendStatus(404);
        });
    } else res.sendStatus(400);
});

// tests

router.get('/users', function (req, res) {
    User.find({}, function (err, users) {
        if(err) throw err;
        res.status(200).json(users);
    });
});

router.put('/ban/:userId', function (req, res) {
    if (validator.isInt(req.params.userId, {min: 1})) {
        User.findOne({userId: req.params.userId}, function (err, user) {
            if (err) throw err;

            if (user) {
                user.isBanned = !user.isBanned;
                user.save(function (err) {
                    if (err) throw err;

                    res.status(200).json({isBanned: user.isBanned});
                });
            } else res.sendStatus(404);
        });
    } else res.sendStatus(400);
});

//

module.exports = router;

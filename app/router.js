var express = require('express');
var validator = require('validator');
var _ = require('underscore');

var User = require('./models/user');

var router = express.Router();

router.get('/', function (req, res) {
    res.render('index', {});
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

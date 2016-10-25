var express = require('express');

var User = require('./models/user');

var router = express.Router();

router.get('/', function (req, res) {
    res.render('index', {});
});

// for test

router.get('/users', function (req, res) {
    User.find({}, function (err, users) {
        if (err) throw err;
        res.json(users);
    });
});

module.exports = router;

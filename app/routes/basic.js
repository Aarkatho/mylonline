var express = require('express');

var User = require('../models/user');

var router = express.Router();

router.get('/', function (req, res) {
	res.render('index', {});
});

router.get('/setup', function (req, res) {
	var mars = new User({
		name: 'aarkatho',
		password: 'aarkpassword',
		admin: true
	});

	mars.save(function (err) {
		if(err) throw err;

		console.log('User saved successfully.');
		res.json({success: true});
	});
});

module.exports = router;

var express = require('express');
var jwt = require('jsonwebtoken');

var tokenRequired = require('../middlewares/token-required');
var User = require('../models/user');

var router = express.Router();

router.post('/authenticate', function (req, res) {
	User.findOne({
		name: req.body.name
	}, function (err, user) {
		if(err) throw err;

		if(user) {
			if(req.body.password != user.password) {
				res.json({
					success: false,
					message: 'Authentication failed. Wrong password.'
				});
			}
			else {
				var token = jwt.sign({name: user.name}, req.app.get('secret key'), {
					expiresIn: '30s'
				});

				res.json({
					success: true,
					message: 'Enjoy your token.',
					token: token
				});
			}
		}
		else {
			res.json({
				success: false,
				message: 'Authentication failed. User not found.'
			});
		}
	});
});

router.get('/users', tokenRequired, function (req, res) {
	User.find({}, function (err, users) {
		if(err) throw err;

		res.json(users);
	});
});

module.exports = router;

var express = require('express');

var User = require('../models/user');

var router = express.Router();

router.get('/', function (req, res) {
	// obtener cookie y ver si mostrar login o no
	res.render('index', {});
});

module.exports = router;

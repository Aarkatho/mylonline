var express = require('express');
var jwt = require('jsonwebtoken');

var tokenRequired = require('../middlewares/token-required');
var User = require('../models/user');

var router = express.Router();

router.post('/user', function (req, res) {
    User.findOne({email: req.body.email}, function (err, user) {
        if (err) throw err;

        if (user) {
            res.json({
                success: false,
                message: 'Email no disponible'
            });
        } else {
            var usr = new User({
                email: req.body.email,
                password: req.body.password
            });

            usr.save(function (err) {
                if (err) throw err;

                res.json({success: true});
            });
        }
    });
});

router.put('/user', function (req, res) {
    //
});

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

router.post('/user/auth/facebook', function (req, res) {
    //
});

router.get('/user/:name', function (req, res) { // obtener usuario
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

router.get('/users', function (req, res) {
    User.find({}, function (err, users) {
        if(err) throw err;

        res.json(users);
    });
});

module.exports = router;

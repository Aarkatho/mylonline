var express = require('express');
var http = require('http');
var socketIo = require('socket.io');
var hoganExpress = require('hogan-express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var expressSession = require('express-session');
var validator = require('validator');
var _ = require('underscore');

var config = require('./config');
var router = require('./app/router');
var User = require('./app/models/user');

var app = express();
var server = http.createServer(app);
var io = socketIo.listen(server);

app.set('views', __dirname + '/app/views');
app.set('view engine', 'html');
app.engine('html', hoganExpress);

app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(__dirname + '/app/public'));

var sessionMiddleware = expressSession({
    secret: config['secret key'],
    resave: false,
    saveUninitialized: true
});

io.use(function (socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
});

app.use(sessionMiddleware);

app.use('/', router);

// Socket.IO

io.on('connection', function (socket) {
    // auth

    socket.on('auth:register', function (data) {
        var usernameValidationError;
        var passwordValidationError;
        var rpasswordValidationError;
        var emailValidationError;

        !validator.isAlphanumeric(data.username) || !validator.isLength(data.username, {min: 4, max: 16}) ?
            usernameValidationError = true : usernameValidationError = false;

        !validator.isAlphanumeric(data.password) || !validator.isLength(data.password, {min: 3, max: 16}) ?
            passwordValidationError = true : passwordValidationError = false;

        !validator.equals(data.password, data.rpassword) ?
            rpasswordValidationError = true : rpasswordValidationError = false;

        !validator.isEmail(data.email) ?
            emailValidationError = true : emailValidationError = false;

        if (usernameValidationError || passwordValidationError || rpasswordValidationError || emailValidationError) {
            socket.emit('auth:register', {
                success: false,
                errorType: 'Bad request',
                errors: {
                    usernameValidationError: usernameValidationError,
                    passwordValidationError: passwordValidationError,
                    rpasswordValidationError: rpasswordValidationError,
                    emailValidationError: emailValidationError
                }
            });
        } else {
            var username = data.username.toLowerCase();
            var email = data.email.toLowerCase();

            User.find({$or: [{username: username}, {email: email}]}, function (err, users) {
                if (err) throw err;
                var usernameExists;
                var emailExists;
                _.findWhere(users, {username: username}) ? usernameExists = true : usernameExists = false;
                _.findWhere(users, {email: email}) ? emailExists = true : emailExists = false;

                if (usernameExists || emailExists) {
                    socket.emit('auth:register', {
                        success: false,
                        errorType: 'Conflict',
                        erros: {
                            usernameExists: usernameExists,
                            emailExists: emailExists
                        }
                    });
                } else {
                    var usr = new User({
                        username: username,
                        password: data.password,
                        email: email
                    });

                    usr.save(function (err) {
                        if (err) throw err;

                        socket.emit('auth:register', {success: true});
                    });
                }
            });
        }
    });

    socket.on('auth:login', function (data) {
        var username = data.username.toLowerCase();

        User.findOne({username: username}, function (err, user) {
            if (err) throw err;

            if (user) {
                if (data.password === user.password) {
                    socket.request.session.user = {};
                    socket.request.session.user.userId = user.userId;
                    socket.request.session.user.isAdmin = user.isAdmin;
                    socket.request.session.user.isBanned = user.isBanned;
                    socket.emit('auth:login', {success: true, data: {userId: user.userId}});
                } else socket.emit('auth:login', {success: false, errorType: 'Bad request'});
            } else socket.emit('auth:login', {success: false, errorType: 'Not found'});
        });
    });

    // Backbone.js CRUD

    socket.on('create', function (data) {});

    socket.on('read', function (data) {
        var modelId = data.modelId.toString();

        switch (data.modelType) {
            case 'user':
                if (socket.request.session.user) {
                    if (validator.isInt(modelId, {min: 1})) {
                        User.findOne({userId: modelId}, function (err, user) {
                            if (err) throw err;

                            if (user) {
                                var modelData = {
                                    username: user.username,
                                    email: user.email
                                };

                                if (socket.request.session.user.userId === user.userId) {
                                    _.extend(modelData, {
                                        isAdmin: user.isAdmin,
                                        isBanned: user.isBanned
                                    });
                                }

                                socket.emit('read:user', {success: true, data: modelData});
                            } else socket.emit('read:user', {success: false, errorType: 'Not found'});
                        });
                    } else socket.emit('read:user', {success: false, errorType: 'Bad request'});
                } else socket.emit('read:user', {success: false, errorType: 'Unauthorized'});
                break;
        }
    });

    socket.on('update', function (data) {});

    socket.on('delete', function (data) {});
});

// Conectamos la base de datos

mongoose.connect(config['database'], function (err) {
    if (err) throw err;
});

// Iniciamos el servidor

var port = process.env.PORT || 2812;

server.listen(port, function () {
    console.log('--------------- MyL Online ---------------');
    console.log('Autor: Narkatho');
    console.log('Servidor escuchando el puerto ' + port + '...');
    console.log('------------------------------------------');
});

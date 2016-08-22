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
    socket.on('read', function (data) {
        var modelId = data.modelId.toString();

        switch (data.modelType) {
            case 'user':
                if (validator.isInt(modelId, {min: 1})) {
                    User.findOne({userId: modelId}, function (err, user) {
                        if (err) throw err;

                        if (user) {
                            var modelData = {
                                username: user.username,
                                email: user.email
                            };

                            if (socket.request.session.username === user.username) {
                                _.extend(modelData, {
                                    isAdmin: user.isAdmin,
                                    isBanned: user.isBanned
                                });
                            }

                            socket.emit('read:user', {success: true, data: modelData});
                        } else socket.emit('read:user', {success: false});
                    });
                } else socket.emit('read:user', {success: false});
                break;
        }
    });
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

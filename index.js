var express = require('express');
var http = require('http');
var socketIo = require('socket.io');
var hoganExpress = require('hogan-express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var expressSession = require('express-session');
var bluebird = require('bluebird');

var router = require('./app/router');
var socketIoListeners = require('./app/socketio-listeners');
var User = require('./app/models/user');

var app = express();
var server = http.Server(app);
var io = socketIo(server);
var sessionMiddleware = expressSession({
    secret: 'Nothing is true',
    resave: false,
    saveUninitialized: false
});

app.set('views', __dirname + '/app/views');
app.set('view engine', 'html');

app.use(morgan('dev'));
app.use(express.static(__dirname + '/app/public'));
app.use('/', router);
app.use(sessionMiddleware);

app.engine('html', hoganExpress);

io.use(function (socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
});

socketIoListeners.initialize(io);

mongoose.Promise = bluebird;

mongoose.connect('mongodb://test:123@jello.modulusmongo.net:27017/yqeguW4i', function (err) {
    if (err) throw err;

    User.findOne({standarizedUsername: 'root'}, function (err, user) {
        new Promise(function (resolve, reject) {
            if (err) throw err;

            if (user) resolve();
            else {
                user = new User({
                    standarizedUsername: 'root',
                    username: 'Root',
                    password: '0208212mc',
                    email: 'root.mylonline@gmail.com',
                    isRoot: true
                });

                user.save(function (err) {
                    if (err) throw err;
                    resolve();
                });
            }
        }).then(function () {
            var port = process.env.PORT || 1234;

            server.listen(port, function () {
                console.log('server listening on port ' + port);
            });
        });
    });
});

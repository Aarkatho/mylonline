var express = require('express');
var http = require('http');
var socketIo = require('socket.io');
var hoganExpress = require('hogan-express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var expressSession = require('express-session');

var router = require('./app/router');
var socketIoListeners = require('./app/socketio-listeners');

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

mongoose.connect('mongodb://test1:123@jello.modulusmongo.net:27017/guP9ybud', function (err) {
    if (err) throw err;
    var port = process.env.PORT || 1234;

    server.listen(port, function () {
        console.log('server listening on port ' + port);
    });
});

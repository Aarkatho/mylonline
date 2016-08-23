var express = require('express');
var http = require('http');
var socketIo = require('socket.io');
var hoganExpress = require('hogan-express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var expressSession = require('express-session');

var config = require('./config');
var router = require('./app/router');
var socketIoListeners = require('./app/socketio-listeners');

var app = express();
var server = http.createServer(app);
var io = socketIo.listen(server);

// de aquí para abajo hay que ordenar

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

socketIoListeners.initialize(io);

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

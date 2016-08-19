var express = require('express');
var http = require('http');
var socketIo = require('socket.io');
var hoganExpress = require('hogan-express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var config = require('./config');
var router = require('./app/router');

var app = express();
var server = http.createServer(app);
var io = socketIo(server);

app.set('views', __dirname + '/app/views');
app.set('view engine', 'html');
app.engine('html', hoganExpress);

app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(__dirname + '/app/public'));

app.use('/', router);

// connect database

mongoose.connect(config['database'], function (err) {
    if (err) throw err;
});

// io

io.on('connection', function (socket) {
    console.log('a user connected.');
});

// start server
var port = process.env.PORT || 2812;

server.listen(port, function () {
    console.log('Listening on port ' + port + '.');
});

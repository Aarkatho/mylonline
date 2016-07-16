// packages

var express = require('express');
var http = require('http'); // temp
var io = require('socket.io'); // temp
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var hoganExpress = require('hogan-express');

var config = require('./config');
var basicRoutes = require('./app/routes/basic');
var apiRoutes = require('./app/routes/api');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

app.set('secret key', config['secret key']);

// view engine setup
app.set('views', __dirname + '/app/views');
app.set('view engine', 'html');
app.engine('html', hoganExpress);

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(__dirname + '/app/public'));

app.use('/', basicRoutes);
app.use('/api', apiRoutes);

// connect database
mongoose.connect(config['database'], function (err) {
    if(err) throw err;
});

// wstest >

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

// <

// start server
var port = process.env.PORT || 2812;

server.listen(port, function () {
    console.log('Listening on port ' + port + '.');
});

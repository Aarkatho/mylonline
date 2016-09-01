var authHandler = require('./socketio-handlers/auth');
var userActionsHandler = require('./socketio-handlers/user-actions');
var adminActionsHandler = require('./socketio-handlers/admin-actions');
var readHandler = require('./socketio-handlers/read');

var users = [];

module.exports.initialize = function (io) {
    io.on('connection', function (socket) {
        socket.on('disconnect', function () {});

        socket.on('auth', function (data) {
            authHandler(io, socket, data);
        });

        socket.on('user_action', function (data) {
            userActionsHandler(socket, data);
        });

        socket.on('admin_action', function (data) {
            adminActionsHandler(io, socket, data);
        });

        socket.on('read', function (data) {
            readHandler(socket, data);
        });
    });
};

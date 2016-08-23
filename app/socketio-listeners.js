var authHandler = require('./socketio-handlers/auth');
var userActionsHandler = require('./socketio-handlers/user-actions');
var adminActionsHandler = require('./socketio-handlers/admin-actions');
var readHandler = require('./socketio-handlers/read');

module.exports.initialize = function (io) {
    io.on('connection', function (socket) {
        socket.on('auth', function (data) {
            authHandler(socket, data);
        });

        socket.on('user_action', function (data) {
            userActionsHandler(socket, data);
        });

        socket.on('admin_action', function (data) {
            adminActionsHandler(socket, data);
        });

        socket.on('create', function (data) {});

        socket.on('read', function (data) {
            readHandler(socket, data);
        });

        socket.on('update', function (data) {});
        socket.on('delete', function (data) {});
    });
};

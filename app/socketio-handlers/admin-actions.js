var validator = require('validator');

var User = require('../models/user');

module.exports = function (io, socket, data) {
    if (socket.request.session.user) {
        if (socket.request.session.user.isAdmin) {
            switch (data.action) {
                case 'ban':
                    var tUserId = data.data.tUserId.toString();

                    if (validator.isInt(tUserId, {min: 1})) {
                        User.findOne({userId: tUserId}, function (err, user) {
                            if (err) throw err;

                            if (user) {
                                user.isBanned = true;

                                user.save(function (err) {
                                    if (err) throw err;
                                    socket.emit('admin_action', {success: true});
                                });
                            } else socket.emit('admin_action', {success: false, errorType: 'Not found'});
                        });
                    } else socket.emit('admin_action', {success: false, errorType: 'Bad request'});

                    break;

                case 'unban':
                    var tUserId = data.data.tUserId.toString();

                    if (validator.isInt(tUserId, {min: 1})) {
                        User.findOne({userId: tUserId}, function (err, user) {
                            if (err) throw err;

                            if (user) {
                                user.isBanned = false;

                                user.save(function (err) {
                                    if (err) throw err;
                                    socket.emit('admin_action', {success: true});
                                });
                            } else socket.emit('admin_action', {success: false, errorType: 'Not found'});
                        });
                    } else socket.emit('admin_action', {success: false, errorType: 'Bad request'});
                    break;

                case 'warn':
                    break;

                case 'announce':
                    break;
            }
        } else socket.emit('admin_action', {success: false, errorType: 'Forbidden'});
    } else socket.emit('admin_action', {success: false, errorType: 'Unauthorized'});
};

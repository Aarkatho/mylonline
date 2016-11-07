var validator = require('validator');
var _ = require('underscore');

var User = require('./models/user');

module.exports.initialize = function (io) {
    io.on('connection', function (socket) {
        socket.on('disconnect', function () {
            if (socket.user) {
                io.emit('application action', 'update userlist', _.map(io.sockets.connected, function (socket) {
                    return socket.user;
                }));
            }
        });

        socket.on('anonymous action', function (action, data) {
            switch (action) {
                case 'login':
                    var standarizedUsername = data.username.toLowerCase();

                    User.findOne({standarizedUsername: standarizedUsername}, function (err, user) {
                        if (err) throw err;

                        if (user) {
                            if (data.password === user.password) {
                                if (user.isBanned) {
                                    socket.emit('anonymous action', {
                                        success: false,
                                        errorCode: 3
                                    });
                                } else {
                                    _.each(io.sockets.connected, function (socket) {
                                        if (socket.user) {
                                            if (socket.user.userId === user.userId) socket.disconnect();
                                        }
                                    });

                                    socket.user = user.getSessionAttrs();

                                    io.emit('application action', 'update userlist', _.map(io.sockets.connected, function (socket) {
                                        return socket.user;
                                    }));

                                    socket.emit('anonymous action', {
                                        success: true,
                                        attrs: user.getPrivateAttrs()
                                    });
                                }
                            } else {
                                socket.emit('anonymous action', {
                                    success: false,
                                    errorCode: 2
                                });
                            }
                        } else {
                            socket.emit('anonymous action', {
                                success: false,
                                errorCode: 1
                            });
                        }
                    });

                    break;
                case 'register':
                    var usernameValidationError = validator.isAlphanumeric(data.username) && validator.isLength(data.username, {min: 4, max: 16}) ?
                        false : true;

                    var emailValidationError = validator.isEmail(data.email) && validator.isLength(data.email, {max: 254}) ? false : true;

                    var passwordValidationError = validator.isAlphanumeric(data.password) && validator.isLength(data.password, {min: 3, max: 16}) ?
                        false : true;

                    if (usernameValidationError || emailValidationError || passwordValidationError) {
                        socket.emit('anonymous action', {
                            success: false,
                            errorCode: 1,
                            attrsWithError: {
                                username: usernameValidationError,
                                email: emailValidationError,
                                password: passwordValidationError
                            }
                        });
                    } else {
                        var standarizedUsername = data.username.toLowerCase();
                        var standarizedEmail = data.email.toLowerCase();

                        User.find({
                            $or: [{standarizedUsername: standarizedUsername}, {email: standarizedEmail}]
                        }, function (err, users) {
                            if (err) throw err;
                            var usernameExists = _.findWhere(users, {standarizedUsername: standarizedUsername}) ? true : false;
                            var emailExists = _.findWhere(users, {email: standarizedEmail}) ? true : false;

                            if (usernameExists || emailExists) {
                                socket.emit('anonymous action', {
                                    success: false,
                                    errorCode: 2,
                                    attrsWithError: {
                                        username: usernameExists,
                                        email: emailExists
                                    }
                                });
                            } else {
                                var user = new User({
                                    standarizedUsername: standarizedUsername,
                                    username: data.username,
                                    email: standarizedEmail,
                                    password: data.password
                                });

                                user.save(function (err) {
                                    if (err) throw err;
                                    socket.emit('anonymous action', {success: true});
                                });
                            }
                        });
                    }

                    break;
            }
        });

        socket.on('application action', function (action, data) {});
    });
};

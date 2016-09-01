var validator = require('validator');
var _ = require('underscore');

var User = require('../models/user');

var users = [];

module.exports = function (io, socket, data) {
    var event = 'auth:' + data.action;

    switch (data.action) {
        case 'login':
            var username = data.data.username.toLowerCase();

            User.findOne({username: username}, function (err, user) {
                if (err) throw err;

                if (user) {
                    if (data.data.password === user.password) {
                        if (user.isBanned) {
                            socket.emit(event, {success: false, errorType: 'Forbidden'});
                            socket.disconnect();
                        } else {
                            socket.request.session.user = {};
                            socket.request.session.user.userId = user.userId;
                            socket.request.session.user.isAdmin = user.isAdmin;
                            socket.request.session.user.isBanned = user.isBanned;
                            socket.emit(event, {success: true, data: {userId: user.userId}});
                            users.push(user.username);
                            io.emit('update', users);
                        }
                    } else socket.emit(event, {success: false, errorType: 'Bad request'});
                } else socket.emit(event, {success: false, errorType: 'Not found'});
            });

            break;

        case 'register':
            var usernameValidationError;
            var passwordValidationError;
            var rpasswordValidationError;
            var emailValidationError;

            !validator.isAlphanumeric(data.data.username) || !validator.isLength(data.data.username, {min: 4, max: 16}) ?
                usernameValidationError = true : usernameValidationError = false;

            !validator.isAlphanumeric(data.data.password) || !validator.isLength(data.data.password, {min: 3, max: 16}) ?
                passwordValidationError = true : passwordValidationError = false;

            !validator.equals(data.data.password, data.data.rpassword) ?
                rpasswordValidationError = true : rpasswordValidationError = false;

            !validator.isEmail(data.data.email) ?
                emailValidationError = true : emailValidationError = false;

            if (usernameValidationError || passwordValidationError || rpasswordValidationError || emailValidationError) {
                socket.emit(event, {
                    success: false,
                    errorType: 'Bad request',
                    errors: {
                        usernameValidationError: usernameValidationError,
                        passwordValidationError: passwordValidationError,
                        rpasswordValidationError: rpasswordValidationError,
                        emailValidationError: emailValidationError
                    }
                });
            } else {
                var username = data.data.username.toLowerCase();
                var email = data.data.email.toLowerCase();

                User.find({$or: [{username: username}, {email: email}]}, function (err, users) {
                    if (err) throw err;
                    var usernameExists;
                    var emailExists;
                    _.findWhere(users, {username: username}) ? usernameExists = true : usernameExists = false;
                    _.findWhere(users, {email: email}) ? emailExists = true : emailExists = false;

                    if (usernameExists || emailExists) {
                        socket.emit(event, {
                            success: false,
                            errorType: 'Conflict',
                            errors: {
                                usernameExists: usernameExists,
                                emailExists: emailExists
                            }
                        });
                    } else {
                        var user = new User({
                            username: username,
                            password: data.data.password,
                            email: email
                        });

                        user.save(function (err) {
                            if (err) throw err;

                            socket.emit(event, {success: true});
                        });
                    }
                });
            }
            break;
    }
};

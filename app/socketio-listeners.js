var validator = require('validator');
var _ = require('underscore');

var User = require('./models/user');

module.exports.initialize = function (io) {
    io.on('connection', function (socket) {
        socket.on('disconnect', function () {
            if (socket.request.session.user) users.remove(socket.request.session.user.userId);
        });

        socket.on('root action', function (action, data) {
            if (socket.request.session.user) {
                if (socket.request.session.user.isRoot) {
                    switch (action) {
                        case 'promote':
                            var tUserId = data.tUserId.toString();

                            if (validator.isInt(tUserId, {min: 1})) {
                                User.findOne({userId: tUserId}, function (err, user) {
                                    if (err) throw err;

                                    if (user) {
                                        if (user.isRoot) {
                                            socket.emit('root action', {
                                                success: false,
                                                errorMessage: 'El usuario objetivo (' + user.username + ') es root'
                                            });
                                        } else if (user.isAdmin) {
                                            socket.emit('root action', {
                                                success: false,
                                                errorMessage: 'El usuario objetivo (' + user.username + ') ya es administrador'
                                            });
                                        } else {
                                            user.isAdmin = true;

                                            user.save(function (err) {
                                                if (err) throw err;

                                                socket.emit('root action', {
                                                    success: true,
                                                    message: 'El usuario objetivo (' + user.username + ') ha sido ascendido a administrador'
                                                });
                                            });
                                        }
                                    } else {
                                        socket.emit('root action', {
                                            success: false,
                                            errorMessage: 'No se ha encontrado el usuario objetivo'
                                        });
                                    }
                                });
                            } else {
                                socket.emit('root action', {
                                    success: false,
                                    errorMessage: ''
                                });
                            }

                            break;
                    }
                } else {
                    socket.emit('root action', {
                        success: false,
                        errorMessage: 'No tienes los permisos para llevar a cabo esta acción'
                    });
                }
            } else {
                socket.emit('root action', {
                    success: false,
                    errorMessage: 'Debes iniciar sesión para llevar a cabo esta acción'
                });
            }
        });

        socket.on('administrator action', function (action, data) {
            if (socket.request.session.user) {
                if (socket.request.session.user.isRoot || socket.request.session.user.isAdministrator) {
                    switch (action) {
                        case 'ban':
                            var tUserId = data.tUserId.toString();

                            if (validator.isInt(tUserId, {min: 1})) {
                                User.findOne({userId: tUserId}, function (err, user) {
                                    if (err) throw err;

                                    if (user) {
                                        var promise = new Promise(function (resolve, reject) {
                                            if (user.isRoot) reject('No puedes banear a un root');
                                            else if (user.isAdministrator) {
                                                if (socket.request.session.user.isRoot) {
                                                    user.isAdministrator = false;
                                                    resolve();
                                                } else reject('Un administrador no puede banear a otro administrador');
                                            } else resolve();
                                        });

                                        promise.then(function () {
                                            if (user.isBanned) {
                                                socket.emit('administrator action', {
                                                    success: false,
                                                    errorMessage: 'El usuario objetivo (' + user.username + ') ya está baneado'
                                                });
                                            } else {
                                                user.isBanned = true;

                                                user.save(function (err) {
                                                    if (err) throw err;
                                                    if (users.isConnected(user.userId)) users.get(user.userId).socket.disconnect();

                                                    socket.emit('administrator action', {
                                                        success: true,
                                                        message: 'El usuario objetivo (' + user.username + ') ha sido baneado'
                                                    });
                                                });
                                            }
                                        }).catch(function (errorMessage) {
                                            socket.emit('administrator action', {
                                                success: false,
                                                errorMessage: errorMessage
                                            });
                                        });
                                    } else {
                                        socket.emit('administrator action', {
                                            success: false,
                                            errorMessage: 'No se ha encontrado el usuario objetivo'
                                        });
                                    }
                                });
                            } else {
                                socket.emit('administrator action', {
                                    success: false,
                                    errorMessage: 'El valor del parámetro "ID" es inválido'
                                });
                            }

                            break;
                        case 'unban':
                            var tUserId = data.tUserId.toString();

                            if (validator.isInt(tUserId, {min: 1})) {
                                User.findOne({userId: tUserId}, function (err, user) {
                                    if (err) throw err;

                                    if (user) {
                                        if (user.isRoot || user.isAdministrator) {
                                            var is = user.isRoot ? 'root' : 'administrador';

                                            socket.emit('administrator action', {
                                                success: false,
                                                errorMessage: 'El usuario objetivo (' + user.username + ') es ' + is + ', no puede estar baneado'
                                            });
                                        } else {
                                            if (user.isBanned) {
                                                user.isBanned = false;

                                                user.save(function (err) {
                                                    if (err) throw err;

                                                    socket.emit('administrator action', {
                                                        success: true,
                                                        message: 'El usuario objetivo (' + user.username + ') ha sido desbaneado'
                                                    });
                                                });
                                            } else {
                                                socket.emit('administrator action', {
                                                    success: false,
                                                    errorMessage: 'El usuario objetivo (' + user.username + ') no está baneado'
                                                });
                                            }
                                        }
                                    } else {
                                        socket.emit('administrator action', {
                                            success: false,
                                            errorMessage: 'No se ha encontrado el usuario objetivo'
                                        });
                                    }
                                });
                            } else {
                                socket.emit('administrator action', {
                                    success: false,
                                    errorMessage: 'El valor del parámetro "ID" es inválido'
                                });
                            }

                            break;
                        case 'kick':
                            break;
                        case 'warn':
                            break;
                        case 'announce':
                            break;
                    }
                } else {
                    socket.emit('administrator action', {
                        success: false,
                        errorMessage: 'No tienes los permisos para llevar a cabo esta acción'
                    });
                }
            } else {
                socket.emit('administrator action', {
                    success: false,
                    errorMessage: 'Debes iniciar sesión para llevar a cabo esta acción'
                });
            }
        });

        socket.on('user action', function (action, data) {
            if (socket.request.session.user) {
                switch (action) {
                    case 'block':
                        break;
                    case 'add friend':
                        break;
                    case 'remove friend':
                        break;
                }
            } else {
                socket.emit('user action', {
                    success: false,
                    errorMessage: 'Debes iniciar sesión para llevar a cabo esta acción'
                });
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
                                    if (users.isConnected(user.userId)) users.get(user.userId).socket.disconnect();
                                    socket.request.session.user = user.getSessionAttrs();

                                    socket.emit('anonymous action', {
                                        success: true,
                                        attrs: user.getPrivateAttrs()
                                    });

                                    socket.join('users');

                                    users.add({
                                        userId: user.userId,
                                        username: user.username,
                                        socket: socket
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

                    var rpasswordValidationError = validator.equals(data.password, data.rpassword) ? false : true;

                    if (usernameValidationError || emailValidationError || passwordValidationError || rpasswordValidationError) {
                        socket.emit('anonymous action', {
                            success: false,
                            errorCode: 1,
                            attrsWithError: {
                                username: usernameValidationError,
                                email: emailValidationError,
                                password: passwordValidationError,
                                rpassword: rpasswordValidationError
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

        // test
        socket.on('chat msg', function (msg) {
            io.emit('chat msg', msg);
        });
        // <
    });

    var users = {
        list: [],
        add: function (user) {
            this.list.push(user);
            io.to('users').emit('application action', 'update users', this.getAll());
        },
        get: function (userId) {
            return _.findWhere(this.list, {userId: userId});
        },
        getAll: function () {
            return _.map(this.list, function (user) {
                return _.omit(user, 'socket');
            });
        },
        isConnected: function (userId) {
            return _.findIndex(this.list, {userId: userId}) !== -1 ? true : false;
        },
        remove: function (userId) {
            this.list.splice(_.findIndex(this.list, {userId: userId}), 1);
            io.to('users').emit('application action', 'update users', this.getAll());
        }
    };
};

var validator = require('validator');

var User = require('./models/user');

module.exports.initialize = function (io) {
    io.on('connection', function (socket) {
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
                                                socket.emit('administrator action', {
                                                    success: false,
                                                    errorMessage: 'El usuario objetivo (' + user.username + ') no está baneado'
                                                });
                                            } else {
                                                user.isBanned = false;

                                                user.save(function (err) {
                                                    if (err) throw err;

                                                    socket.emit('administrator action', {
                                                        success: true,
                                                        message: 'El usuario objetivo (' + user.username + ') ha sido desbaneado'
                                                    });
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
    });
};

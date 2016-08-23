module.exports = function (socket, data) {
    var event = 'admin_action:' + data.action;

    if (socket.request.session.user) {
        if (socket.request.session.user.isAdmin) {
            switch (data.action) {
                case 'ban':
                case 'unban':
                    var tUserId = data.data.tUserId.toString();

                    if (validator.isInt(tUserId, {min: 1})) {
                        User.findOne({userId: tUserId}, function (err, user) {
                            if (err) throw err;

                            if (user) {
                                user.isBanned = !user.isBanned;

                                user.save(function (err) {
                                    if (err) throw err;
                                    socket.emit(event, {success: true});
                                });
                            } else socket.emit(event, {success: false, errorType: 'Not found'});
                        });
                    } else socket.emit(event, {success: false, errorType: 'Bad request'});

                    break;
                case 'warn':
                    break;
                case 'announce':
                    break;
            }
        } else socket.emit(event, {success: false, errorType: 'Forbidden'});
    } else socket.emit(event, {success: false, errorType: 'Unauthorized'});
};

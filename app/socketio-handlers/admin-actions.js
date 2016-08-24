var User = require('../models/user');

module.exports = function (socket, data) {
    var event = 'admin_action:' + data.action;

    if (socket.request.session.user) {
        if (!socket.request.session.user.isAdmin) {
            switch (data.action) {
                case 'ban':
                    break;

                case 'unban':
                    break;

                case 'warn':
                    break;

                case 'announce':
                    break;

                case 'banmyself':
                    User.findOne({userId: socket.request.session.user.userId}, function (err, user) {
                        if (err) throw err;

                        if (user) {
                            user.isBanned = !user.isBanned;

                            user.save(function (err) {
                                if (err) throw err;
                                socket.emit(event);
                            });
                        } else socket.emit(event, {success: false});
                    });
            }
        } else socket.emit(event, {success: false, errorType: 'Forbidden'});
    } else socket.emit(event, {success: false, errorType: 'Unauthorized'});
};

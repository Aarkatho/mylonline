var validator = require('validator');
var _ = require('underscore');

var User = require('../models/user');

module.exports = function (socket, data) {
    var modelId = data.modelId.toString();
    var event = 'read:' + data.modelType;

    switch (data.modelType) {
        case 'user':
            if (socket.request.session.user) {
                if (validator.isInt(modelId, {min: 1})) {
                    User.findOne({userId: modelId}, function (err, user) {
                        if (err) throw err;

                        if (user) {
                            var modelData = {
                                username: user.username,
                                email: user.email
                            };

                            if (socket.request.session.user.userId === user.userId) {
                                _.extend(modelData, {
                                    isAdmin: user.isAdmin,
                                    isBanned: user.isBanned
                                });
                            }

                            socket.emit(event, {success: true, data: modelData});
                        } else socket.emit(event, {success: false, errorType: 'Not found'});
                    });
                } else socket.emit(event, {success: false, errorType: 'Bad request'});
            } else socket.emit(event, {success: false, errorType: 'Unauthorized'});
            break;
    }
};

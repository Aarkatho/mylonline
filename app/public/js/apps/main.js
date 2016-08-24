define(['backbone', 'socket.io', 'router', 'models/user'], function (BB, io, router, UserModel) {
    window.APPLICATION = {};
    APPLICATION.socket = io();
    APPLICATION.user = new UserModel();

    BB.Model.prototype.parse = function (resp, options) {
        return resp.data;
    };

    BB.sync = function (method, model, options) {
        switch (method) {
            case 'create':
                break;
            case 'read':
                APPLICATION.socket.emit('read', {modelType: model.modelType, modelId: model.id});

                APPLICATION.socket.once('read:' + model.modelType, function (data) {
                    data.success ? options.success(data) : options.error(data);
                });

                break;
            case 'update':
                break;
            case 'delete':
                break;
        }
    };

    // for test

    APPLICATION.socket.on('admin_action:banmyself', function (data) {
        APPLICATION.user.fetch();
    });
});

define(['backbone', 'socket.io', 'router', 'models/user'], function (BB, io, router, UserModel) {
    window.APP = {};
    APP.socket = io();
    APP.user = new UserModel();

    BB.Model.prototype.parse = function (resp, options) {
        return resp.data;
    };

    BB.sync = function (method, model, options) {
        switch (method) {
            case 'create':
                break;
            case 'read':
                APP.socket.emit('read', {modelType: model.modelType, modelId: model.id});

                APP.socket.once('read:' + model.modelType, function (data) {
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

    APP.socket.on('admin_action', function (data) {
        APP.user.fetch();
    });

    APP.socket.on('update', function (data) {
        console.log(data);
    });
});

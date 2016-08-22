define(['backbone', 'socket.io', 'router', 'models/user'], function (BB, SocketIO, router, UserModel) {
    window.APPLICATION = {};
    APPLICATION.socket = SocketIO();
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

                APPLICATION.socket.once('read:user', function (data) {
                    data.success ? options.success(data) : options.error(data);
                });

                break;
            case 'update':
                break;
            case 'delete':
                break;
        }
    };
});

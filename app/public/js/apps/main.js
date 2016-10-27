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

    APP.socket.on('disconnect', function () {
        alert('Has sido desconectado del servidor');
        location.reload();
    });

    APP.socket.on('root action', function (data) {
        console.log(data);
    });

    APP.socket.on('administrator action', function (data) {
        console.log(data);
    });

    APP.socket.on('user action', function (data) {
        console.log(data);
    });

    APP.socket.on('anonymous action', function (data) {
        console.log(data);
    });

    APP.socket.on('application action', function (action, data) {
        switch (action) {
            case 'update users':
                console.log('users list updated', data);
                break;
        }
    });
});

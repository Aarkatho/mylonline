define(['backbone', 'socket.io', 'router'], function (BB, io, router) {
    window.APP = {
        socket: io()
    };

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
        alert('Desconectado');
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
        console.log(data);

        switch (action) {
            case 'update userlist':
                APP.users.set(data);
                break;
        }
    });
});

define(['backbone', 'router'], function (BB, router) {
    console.log('--- APP PRINCIPAL CARGADA ---');

    var useToken = function (token) {
        BB.$.ajaxSetup({
            beforeSend: function (xhr) {
                xhr.setRequestHeader('X-Access-Token', token);
            }
        });
    };

    useToken();
});

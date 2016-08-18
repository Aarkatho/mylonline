define(['views/login'], function (LoginView) {
    console.log('APP CARGADA: apps/auth-login.js');

    return {
        initialize: function () {
            this.subViews = [new LoginView()];
        }
    };
});

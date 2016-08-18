define(['views/register'], function (RegisterView) {
    console.log('APP CARGADA: apps/auth-register.js');

    return {
        initialize: function () {
            this.subViews = [new RegisterView()];
        }
    };
});

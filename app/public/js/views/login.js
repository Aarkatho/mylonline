define(['backbone', 'jquery'], function (BB, $) {
    return BB.View.extend({
        el: '#login-form',
        events: {
            'submit': 'login'
        },
        initialize: function () {
            console.log('inicializando views/login.js');
        }
    });
});

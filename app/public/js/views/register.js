define(['backbone', 'jquery'], function (BB, $) {
    return BB.View.extend({
        el: '#register-form',
        events: {
            'submit': 'register'
        },
        initialize: function () {
            console.log('inicializando views/register.js');
        }
    });
});

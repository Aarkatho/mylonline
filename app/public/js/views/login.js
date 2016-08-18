define(['backbone'], function (BB) {
    return BB.View.extend({
        el: '#login-form',
        events: {
            'submit': 'login'
        },
        initialize: function () {}
    });
});

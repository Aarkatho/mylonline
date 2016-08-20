define(['backbone'], function (BB) {
    return BB.Model.extend({
        defaults: {
            isLoggedIn: false
        },
        urlRoot: '/user'
    });
});

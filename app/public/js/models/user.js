define(['backbone'], function (BB) {
    return BB.Model.extend({
        defaults: {
            isLoggedIn: false
        },
        modelType: 'user'
    });
});

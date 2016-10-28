define(['backbone', 'models/user'], function (BB, userModel) {
    return BB.Collection.extend({
        model: userModel
    });
});

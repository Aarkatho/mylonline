define(['backbone', 'jquery', 'hgn!templates/pages/sections/auth-register'], function (BB, $, authRegisterTemplate) {
    return BB.View.extend({
        initialize: function () {
            //
        },
        render: function (callback) {
            var markup = authRegisterTemplate({});
            this.setElement('#register');
            this.$el.html(markup);
            callback();
        }
    });
});

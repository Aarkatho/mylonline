define(['backbone', 'jquery', 'hgn!templates/pages/sections/auth-login'], function (BB, $, authLoginTemplate) {
    return BB.View.extend({
        initialize: function () {
            //
        },
        render: function (callback) {
            var markup = authLoginTemplate({});
            this.setElement('#auth-sections');
            this.$el.html(markup);
            callback();
        }
    });
});
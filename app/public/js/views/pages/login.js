define(['backbone', 'jquery', 'hgn!templates/pages/login'], function (BB, $, loginTemplate) {
    return BB.View.extend({
        el: '#page-container',
        initialize: function () {
            //
        },
        render: function (callback) {
            var markup = loginTemplate({});
            this.$el.html(markup);
            callback();
        }
    });
});

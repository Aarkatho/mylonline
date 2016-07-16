define(['backbone', 'jquery', 'hgn!templates/pages/login'], function (BB, $, loginTemplate) {
    return BB.View.extend({
        el: '#pages',
        initialize: function () {
            //
        },
        render: function (callback) {
            var markup = loginTemplate({});
            this.$el.append(markup);
            callback();
        }
    });
});

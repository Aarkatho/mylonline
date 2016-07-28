define(['backbone', 'jquery', 'hgn!templates/pages/auth'], function (BB, $, authTemplate) {
    return BB.View.extend({
        el: '#auth',
        initialize: function () {
            //
        },
        render: function (callback) {
            var markup = authTemplate({});
            this.$el.html(markup);
            callback();
        },
        switchSection: function (section) {
            console.log('switching section: ' + section);
        }
    });
});

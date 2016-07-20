define(['backbone', 'jquery', 'hgn!templates/pages/banned'], function (BB, $, bannedTemplate) {
    return BB.View.extend({
        el: '#banned',
        initialize: function () {
            //
        },
        render: function (callback) {
            var markup = bannedTemplate({});
            this.$el.html(markup);
            callback();
        }
    });
});

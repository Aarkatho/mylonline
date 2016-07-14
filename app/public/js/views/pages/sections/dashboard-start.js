define(['backbone', 'jquery', 'hgn!templates/pages/sections/dashboard-start'], function (BB, $, startTemplate) {
    return BB.View.extend({
        initialize: function () {
            //
        },
        render: function (callback) {
            var markup = startTemplate({});
            this.setElement('#dashboard-section');
            this.$el.html(markup);
            callback();
        }
    });
});

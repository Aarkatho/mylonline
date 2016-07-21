define(['backbone', 'jquery', 'hgn!templates/pages/sections/dashboard-start'], function (BB, $, dashboardStartTemplate) {
    return BB.View.extend({
        initialize: function () {
            //
        },
        render: function (callback) {
            var markup = dashboardStartTemplate({});
            this.setElement('#start');
            this.$el.html(markup);
            callback();
        }
    });
});

define(['backbone', 'jquery', 'hgn!templates/pages/sections/dashboard-shop'], function (BB, $, dashboardShopTemplate) {
    return BB.View.extend({
        initialize: function () {
            //
        },
        render: function (callback) {
            var markup = dashboardShopTemplate({});
            this.setElement('#dashboard-section');
            this.$el.html(markup);
            callback();
        }
    });
});

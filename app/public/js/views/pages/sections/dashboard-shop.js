define(['backbone', 'jquery', 'hgn!templates/pages/sections/dashboard-shop'], function (BB, $, dashboardShopTemplate) {
    return BB.View.extend({
        initialize: function () {
            //
        },
        render: function (callback) {
            var markup = dashboardShopTemplate({});
            this.setElement('#shop');
            this.$el.html(markup);
            callback();
        }
    });
});

define(['backbone', 'jquery', 'hgn!templates/pages/sections/dashboard-shop'], function (BB, $, dashboardShopTemplate) {
    return BB.View.extend({
        id: 'dashboard-shop',
        initialize: function () {},
        render: function () {
            var deferred = BB.$.Deferred();

            var markup = dashboardShopTemplate({});

            this.$el.html(markup);
            this.$el.appendTo('#dashboard-section');
            deferred.resolve();
            return deferred.promise();
        }
    });
});

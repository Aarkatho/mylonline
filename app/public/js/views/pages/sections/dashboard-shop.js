define(['backbone', 'jquery', 'hgn!templates/pages/sections/dashboard-shop'], function (BB, $, dashboardShopTemplate) {
    return BB.View.extend({
        id: 'dashboard-shop',
        className: 'section',
        initialize: function () {},
        render: function () {
            var deferred = BB.$.Deferred();

            var markup = dashboardShopTemplate({});

            this.$el.html(markup);
            this.$el.appendTo('#dashboard-section-container');
            deferred.resolve();
            return deferred.promise();
        }
    });
});

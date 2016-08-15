define(['backbone', 'jquery', 'hgn!templates/pages/sections/dashboard-start'], function (BB, $, dashboardStartTemplate) {
    return BB.View.extend({
        id: 'dashboard-start',
        className: 'section',
        initialize: function () {},
        render: function () {
            var deferred = BB.$.Deferred();

            var markup = dashboardStartTemplate({});

            this.$el.html(markup);
            this.$el.appendTo('#dashboard-section-container');
            deferred.resolve();
            return deferred.promise();
        }
    });
});

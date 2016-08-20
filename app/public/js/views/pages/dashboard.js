define(['backbone', 'hgn!templates/pages/dashboard'], function (BB, dashboardTemplate) {
    return BB.View.extend({
        id: 'dashboard',
        className: 'page',
        initialize: function () {},
        render: function () {
            var self = this;
            var deferred = BB.$.Deferred();

            currentUser.fetch({
                success: function (model, response, options) {
                    console.log(response);
                    var markup = dashboardTemplate({
                        user: {}
                    });

                    self.$el.html(markup);
                    self.$el.appendTo('#page-container');
                    deferred.resolve();
                },
                error: function (model, response, options) {
                    deferred.reject();
                }
            });

            return deferred.promise();
        }
    });
});

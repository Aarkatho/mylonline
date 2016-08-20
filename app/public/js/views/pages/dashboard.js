define(['backbone', 'models/user', 'hgn!templates/pages/dashboard'], function (BB, UserModel, dashboardTemplate) {
    return BB.View.extend({
        id: 'dashboard',
        className: 'page',
        initialize: function () {
            this.user = new UserModel();
        },
        render: function () {
            var self = this;
            var deferred = BB.$.Deferred();

            this.user.fetch({
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

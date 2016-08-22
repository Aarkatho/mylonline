define(['backbone', 'hgn!templates/pages/dashboard'], function (BB, dashboardTemplate) {
    return BB.View.extend({
        id: 'dashboard',
        className: 'page',
        initialize: function () {},
        render: function () {
            var deferred = BB.$.Deferred();

            var markup = dashboardTemplate({
                user: {
                    userId: APPLICATION.user.get('id'),
                    username: APPLICATION.user.get('username'),
                    email: APPLICATION.user.get('email'),
                    isAdmin: APPLICATION.user.get('isAdmin'),
                    isBanned: APPLICATION.user.get('isBanned')
                }
            });

            this.$el.html(markup);
            this.$el.appendTo('#page-container');
            deferred.resolve();

            return deferred.promise();
        }
    });
});

define(['backbone', 'hgn!templates/pages/dashboard'], function (BB, dashboardTemplate) {
    return BB.View.extend({
        id: 'dashboard',
        className: 'page',
        initialize: function () {},
        render: function () {
            var deferred = BB.$.Deferred();

            var markup = dashboardTemplate({
                user: {
                    userId: currentUser.get('id'),
                    username: currentUser.get('username'),
                    email: currentUser.get('email'),
                    isAdmin: currentUser.get('isAdmin'),
                    isBanned: currentUser.get('isBanned')
                }
            });

            this.$el.html(markup);
            this.$el.appendTo('#page-container');
            deferred.resolve();

            return deferred.promise();
        }
    });
});

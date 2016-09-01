define(['backbone', 'hgn!templates/pages/dashboard', 'backbone.stickit'], function (BB, dashboardTemplate) {
    return BB.View.extend({
        id: 'dashboard',
        className: 'page',
        bindings: {
            '#test': {
                observe: 'isBanned',
                update: function ($el, val, model, options) {
                    $el.html('isBanned: ' + val);
                }
            }
        },
        initialize: function () {},
        render: function () {
            var deferred = BB.$.Deferred();

            var markup = dashboardTemplate({
                user: {
                    userId: APP.user.get('id'),
                    username: APP.user.get('username'),
                    email: APP.user.get('email'),
                    isAdmin: APP.user.get('isAdmin'),
                    isBanned: APP.user.get('isBanned')
                }
            });

            this.$el.html(markup);
            this.stickit(APP.user);
            this.$el.appendTo('#page-container');
            deferred.resolve();
            return deferred.promise();
        }
    });
});

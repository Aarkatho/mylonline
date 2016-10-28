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
                    userId: APP.user.get('userId'),
                    username: APP.user.get('username'),
                    email: APP.user.get('email'),
                    isRoot: APP.user.get('isRoot'),
                    isAdministrator: APP.user.get('isAdministrator'),
                }
            });

            this.$el.html(markup);
            this.stickit(APP.user);
            this.$el.appendTo('#page-container');
            $('#online').show(); // test
            deferred.resolve();
            return deferred.promise();
        }
    });
});

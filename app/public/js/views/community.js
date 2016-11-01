define(['backbone', 'views/user', 'backbone.stickit'], function (BB, UserView) {
    return BB.View.extend({
        el: '#dashboard-community',
        bindings: {
            '#dashboard-community-user-icon': {
                observe: 'iconId',
                update: function ($el, val, model, options) {
                    $el.attr('src', 'img/icons/' + val + '.png');
                }
            }
        },
        userViews: [],
        initialize: function () {
            this.stickit(APP.user);
            this.listenTo(APP.users, 'add', this.addUser);
            this.listenTo(APP.users, 'remove', this.removeUser);
        },
        addUser: function (model, collection, options) {
            var userView = new UserView({model: model});
            this.userViews.push(userView);
            this.$('#dashboard-community-general').append(userView.$el);
        },
        removeUser: function (model, collection, options) {
            _.each(this.userViews, function (userView) {
                if (userView.model.id === model.id) userView.remove();
            });
        }
    });
});

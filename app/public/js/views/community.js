define(['backbone', 'views/user'], function (BB, UserView) {
    return BB.View.extend({
        el: '#dashboard-community',
        events: {
            'click #dashboard-community-showButton': 'showCommunityContent'
        },
        userViews: [],
        initialize: function () {
            APP.socket.emit('application action', 'join');
            this.listenTo(APP.users, 'add', this.addUser);
            this.listenTo(APP.users, 'remove', this.removeUser);
        },
        addUser: function (model, collection, options) {
            var userView = new UserView({model: model});
            this.userViews.push(userView);
            this.$('#dashboard-community-userList-general').append(userView.$el);
        },
        removeUser: function (model, collection, options) {
            _.each(this.userViews, function (userView) {
                if (userView.model.id === model.id) userView.remove();
            });
        },
        showCommunityContent: function (event) {
            this.$('#dashboard-community-showButton').hide();
            this.$('#dashboard-community-content').show();
        }
    });
});

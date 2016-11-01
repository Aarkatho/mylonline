define(['backbone', 'hgn!templates/user', 'backbone.stickit'], function (BB, userTemplate) {
    return BB.View.extend({
        tagName: 'li',
        className: 'dashboard-community-userlist-user',
        bindings: {
            '.dashboard-community-userlist-user-icon': {
                observe: 'iconId',
                update: function ($el, val, model, options) {
                    $el.attr('src', 'img/icons/' + val + '.png');
                }
            }
        },
        initialize: function () {
            this.$el.html(userTemplate({}));
            this.stickit(this.model);
        }
    });
});

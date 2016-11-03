define(['backbone', 'hgn!templates/user', 'backbone.stickit'], function (BB, userTemplate) {
    return BB.View.extend({
        tagName: 'li',
        className: 'dashboard-community-userList-user',
        bindings: {
            '> img': {
                observe: 'iconId',
                update: function ($el, val, model, options) {
                    $el.attr('src', 'img/icons/' + val + '.png');
                }
            },
            '> span': {
                observe: 'username',
                update: function ($el, val, model, options) {
                    $el.text(val);
                }
            }
        },
        initialize: function () {
            this.$el.html(userTemplate({}));
            this.stickit(this.model);
        }
    });
});

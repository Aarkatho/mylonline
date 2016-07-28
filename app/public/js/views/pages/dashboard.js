define(['backbone', 'jquery', 'models/user', 'hgn!templates/pages/dashboard'], function (BB, $, UserModel, dashboardTemplate) {
    return BB.View.extend({
        el: '#dashboard',
        initialize: function () {
            this.user = new UserModel();
        },
        render: function (callback) {
            var self = this;
            this.user.fetch({
                success: function (model, response, options) {
                    var markup = dashboardTemplate({
                        user: {
                            //
                        }
                    });
                    self.$el.html(markup);
                    callback();
                },
                error: function (model, response, options) {
                    //
                }
            });
        },
        switchSection: function (section) {
            console.log('switching section: ' + section);
        }
    });
});

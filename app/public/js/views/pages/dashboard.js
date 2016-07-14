define(['backbone', 'jquery', 'models/user', 'hgn!templates/pages/dashboard'], function (BB, $, UserModel, dashboardTemplate) {
    return BB.View.extend({
        el: '#page-container',
        initialize: function () {
            this.user = new UserModel();
        },
        render: function (callback) {
            var self = this;
            this.user.fetch({
                success: function (model, response, options) {
                    var markup = dashboardTemplate({
                        user: {
                            name: response.user.name,
                            password: response.user.password
                        }
                    });
                    self.$el.html(markup);
                    callback();
                },
                error: function (model, response, options) {
                    //
                }
            });
        }
    });
});

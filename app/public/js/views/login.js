define(['backbone'], function (BB) {
    return BB.View.extend({
        el: '#login-form',
        events: {
            'submit': 'login'
        },
        initialize: function () {
            this.$('input[name="username"]').focus();
        },
        login: function (event) {
            event.preventDefault();
            var username = this.$('input[name="username"]').val();
            var password = this.$('input[name="password"]').val();

            APP.socket.emit('auth', {
                action: 'login',
                data: {
                    username: username,
                    password: password
                }
            });

            var self = this;

            APP.socket.once('auth:login', function (response) {
                if (response.success) {
                    APP.user.set({id: response.data.userId});

                    APP.user.fetch({
                        success: function (model, res, options) {
                            APP.user.set({isLoggedIn: true});
                            BB.history.navigate('dashboard', {trigger: true});
                        },
                        error: function (model, res, options) {
                            self.$('.wtf').show();
                        }
                    });
                } else {
                    if (response.errorType === 'Forbidden') BB.history.navigate('banned', {trigger: true});
                    else self.$('.error').show();
                }
            });
        }
    });
});

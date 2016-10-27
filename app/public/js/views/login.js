define(['backbone'], function (BB) {
    return BB.View.extend({
        el: '#login-form',
        events: {
            'submit': 'login'
        },
        initialize: function () {
            this.$('input[name="username"]').focus();
            this.$('input[name="username"]').val(this.$('input[name="username"]').val());
        },
        login: function (event) {
            event.preventDefault();
            var username = this.$('input[name="username"]').val();
            var password = this.$('input[name="password"]').val();

            APP.socket.emit('anonymous action', 'login', {
                username: username,
                password: password
            });

            var self = this;

            APP.socket.once('anonymous action', function (response) {
                if (response.success) {
                    APP.user.set(response.data);
                    BB.history.navigate('dashboard', {trigger: true});

                    /*
                    APP.user.fetch({
                        success: function (model, res, options) {
                            APP.user.set({isLoggedIn: true});
                            BB.history.navigate('dashboard', {trigger: true});
                        },
                        error: function (model, res, options) {
                            self.$('.wtf').show();
                        }
                    });
                    */
                } else {
                    if (response.errorType === 'Forbidden') BB.history.navigate('banned', {trigger: true});
                    else self.$('.error').show();
                }
            });
        }
    });
});

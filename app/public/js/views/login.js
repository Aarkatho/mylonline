define(['backbone', 'models/user', 'collections/users'], function (BB, UserModel, UsersCollection) {
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
            if (this.$('#auth-error-message').is(':visible')) this.$('#auth-error-message').hide();
            var username = this.$('input[name="username"]').val();
            var password = this.$('input[name="password"]').val();

            APP.socket.emit('anonymous action', 'login', {
                username: username,
                password: password
            });

            var self = this;

            APP.socket.once('anonymous action', function (data) {
                if (data.success) {
                    APP.user = new UserModel(data.attrs);
                    APP.users = new UsersCollection(APP.user);
                    BB.history.navigate('dashboard', {trigger: true});
                } else {
                    switch (data.errorCode) {
                        case 1:
                            self.$('#auth-error-message').text('No se encontró una cuenta con ese nombre de usuario.');
                            break;
                        case 2:
                            self.$('#auth-error-message').text('Contraseña incorrecta.');
                            break;
                        case 3:
                            self.$('#auth-error-message').text('Tu cuenta está baneada.');
                            break;
                    }

                    self.$('#auth-error-message').show();
                }
            });
        }
    });
});

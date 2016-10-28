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
            var username = this.$('input[name="username"]').val();
            var password = this.$('input[name="password"]').val();

            APP.socket.emit('anonymous action', 'login', {
                username: username,
                password: password
            });

            var self = this;

            APP.socket.once('anonymous action', function (data) {
                if (data.success) {
                    APP.user = new UserModel(data.attributes);
                    APP.users = new UsersCollection(APP.user);
                    BB.history.navigate('dashboard', {trigger: true});
                } else {
                    switch (data.errorCode) {
                        case 1:
                            APP.currentPage.currentSection.view.showErrorMessage('No existe una cuenta con el nombre de usuario ingresado');
                            break;
                        case 2:
                            APP.currentPage.currentSection.view.showErrorMessage('Contraseña incorrecta');
                            break;
                        case 3:
                            APP.currentPage.currentSection.view.showErrorMessage('Tu cuenta está baneada');
                            break;
                    }
                }
            });
        }
    });
});

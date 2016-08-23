define(['backbone'], function (BB) {
    return BB.View.extend({
        el: '#register-form',
        events: {
            'submit': 'register'
        },
        initialize: function () {},
        register: function (event) {
            event.preventDefault();
            var username = this.$('input[name="username"]').val();
            var password = this.$('input[name="password"]').val();
            var rpassword = this.$('input[name="rpassword"]').val();
            var email = this.$('input[name="email"]').val();

            APPLICATION.socket.emit('auth', {
                action: 'register',
                data: {
                    username: username,
                    password: password,
                    rpassword: rpassword,
                    email: email
                }
            });

            APPLICATION.socket.once('auth:register', function (data) {
                if (data.success) {
                    alert('Tu cuenta ha sido creada, ahora ingresa con ella (WS).');
                    BB.history.navigate('auth/login', {trigger: true});
                } else alert('Error al registrarse (errorType: ' + data.errorType + ')');
            });
        }
    });
});

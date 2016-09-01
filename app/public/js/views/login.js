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

            APP.socket.once('auth:login', function (data) {
                if (data.success) {
                    APP.user.set({id: data.data.userId});

                    APP.user.fetch({
                        success: function (model, response, options) {
                            alert(username + ', bienvenido a MyL Online (WS).');
                            APP.user.set({isLoggedIn: true});
                            BB.history.navigate('dashboard', {trigger: true});
                        },
                        error: function (model, response, options) {
                            alert('Ha ocurrido un error al intentar obtener los datos de tu cuenta.');
                        }
                    });
                } else {
                    if (data.errorType === 'Forbidden') {
                        alert('Tu cuenta esta banneada.');
                        BB.history.navigate('banned', {trigger: true});
                    } else alert('Error (errorType: ' + data.errorType + ')');
                }
            });
        }
    });
});

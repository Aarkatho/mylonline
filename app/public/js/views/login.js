define(['backbone'], function (BB) {
    return BB.View.extend({
        el: '#login-form',
        events: {
            'submit': 'login'
        },
        initialize: function () {},
        login: function (event) {
            event.preventDefault();
            var username = this.$('input[name="username"]').val();
            var password = this.$('input[name="password"]').val();

            APPLICATION.socket.emit('auth', {
                action: 'login',
                data: {
                    username: username,
                    password: password
                }
            });

            APPLICATION.socket.once('auth:login', function (data) {
                console.log(data);
                if (data.success) {
                    APPLICATION.user.set({id: data.data.userId});

                    APPLICATION.user.fetch({
                        success: function (model, response, options) {
                            alert(username + ', bienvenido a MyL Online (WS).');
                            APPLICATION.user.set({isLoggedIn: true});

                            response.data.isBanned ?
                                BB.history.navigate('banned', {trigger: true}) :
                                BB.history.navigate('dashboard', {trigger: true});
                        },
                        error: function (model, response, options) {
                            alert('Ha ocurrido un error al intentar obtener los datos de tu cuenta.');
                        }
                    });
                } else alert('Error al iniciar sesión (errorType: ' + data.errorType + ')');
            });
        }
    });
});

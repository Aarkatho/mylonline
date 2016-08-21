define(['backbone', 'https://cdn.socket.io/socket.io-1.4.5.js', 'models/user'], function (BB, io, UserModel) {
    return BB.View.extend({
        el: '#login-form',
        events: {
            'submit': 'login'
        },
        initialize: function () {
            var socket = io();
        },
        login: function (event) {
            event.preventDefault();
            var username = this.$('input[name="username"]').val();
            var password = this.$('input[name="password"]').val();

            var $post = BB.$.post('/login', {
                username: username,
                password: password
            });

            $post.done(function (userId) {
                currentUser.set({id: userId});
                currentUser.fetch({
                    success: function (model, response, options) {
                        alert(username + ', bienvenido a Myl Online.');
                        currentUser.set({isLoggedIn: true});

                        response.isBanned ?
                            BB.history.navigate('banned', {trigger: true}) :
                            BB.history.navigate('dashboard', {trigger: true});
                    },
                    error: function (model, response, options) {
                        alert('Ha ocurrido un error al intentar obtener los datos de tu cuenta.');
                    }
                });
            });

            $post.fail(function (data) {
                console.log('fail!', data);
            });

            $post.always(function () {});
        }
    });
});
 
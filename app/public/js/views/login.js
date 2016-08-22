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

            var $post = BB.$.post('/login', {
                username: username,
                password: password
            });

            $post.done(function (userId) {
                APPLICATION.user.set({id: userId});

                APPLICATION.user.fetch({
                    success: function (model, response, options) {
                        alert(username + ', bienvenido a Myl Online.');
                        APPLICATION.user.set({isLoggedIn: true});

                        response.data.isBanned ?
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

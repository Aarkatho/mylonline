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

            var $post = BB.$.post('/api/user', {
                username: username,
                password: password,
                rpassword: rpassword,
                email: email
            });

            $post.done(function () {
                alert('Ahora debes ingresar con tu nueva cuenta');
                BB.history.navigate('auth/login', {trigger: true});
            });

            $post.fail(function (data) {
                console.log('fail!', data);
            });

            $post.always(function () {});
        }
    });
});

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

            console.log('--- values ---');
            console.log(username);
            console.log(password);
            console.log(rpassword);
            console.log(email);
            console.log('--- /values ---');

            var $post = BB.$.post('/api/user', {
                username: username,
                password: password,
                rpassword: rpassword,
                email: email
            });

            $post.done(function (data) {
                console.log('done!', data);
            });

            $post.fail(function (data) {
                console.log('fail!', data);
            });

            $post.always(function (data) {});
        }
    });
});

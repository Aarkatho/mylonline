define(['backbone', 'https://cdn.socket.io/socket.io-1.4.5.js'], function (BB, io) {
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

            var $post = BB.$.post('/authenticate', {
                username: username,
                password: password
            });

            $post.done(function (data) {
                console.log('done!', data);
                var socket = io();
            });

            $post.fail(function (data) {
                console.log('fail!', data);
            });

            $post.always(function () {});
        }
    });
});

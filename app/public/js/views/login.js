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

            $post.done(function () {
                isLoggedIn = true;
                alert(username + ', bienivenido a MyL Online.');
                BB.history.navigate('dashboard', {trigger: true});
            });

            $post.fail(function (data) {
                console.log('fail!', data);
            });

            $post.always(function () {});
        }
    });
});

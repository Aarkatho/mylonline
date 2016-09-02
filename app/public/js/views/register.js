define(['backbone'], function (BB) {
    return BB.View.extend({
        el: '#register-form',
        events: {
            'submit': 'register'
        },
        initialize: function () {
            this.$('input[name="username"]').focus();
        },
        register: function (event) {
            event.preventDefault();
            var username = this.$('input[name="username"]').val();
            var password = this.$('input[name="password"]').val();
            var rpassword = this.$('input[name="rpassword"]').val();
            var email = this.$('input[name="email"]').val();

            APP.socket.emit('auth', {
                action: 'register',
                data: {
                    username: username,
                    password: password,
                    rpassword: rpassword,
                    email: email
                }
            });

            var self = this;

            APP.socket.once('auth:register', function (response) {
                if (response.success) BB.history.navigate('auth/login', {trigger: true});
                else {
                    response.errorType === 'Bad request' ?
                        self.showBadRequestErrors(response.errors) :
                        self.showConflictErrors(response.errors);
                }
            });
        },
        showBadRequestErrors: function (errors) {
            if (errors.usernameValidationError) this.$('#username-input > p.bad-request-error').show();
            if (errors.passwordValidationError) this.$('#password-input > p.bad-request-error').show();
            if (errors.rpasswordValidationError) this.$('#rpassword-input > p.bad-request-error').show();
            if (errors.emailValidationError) this.$('#email-input > p.bad-request-error').show();
        },
        showConflictErrors: function (errors) {
            if (errors.usernameExists) this.$('#username-input > p.conflict-error').show();
            if (errors.emailExists) this.$('#email-input > p.conflict-error').show();
        }
    });
});

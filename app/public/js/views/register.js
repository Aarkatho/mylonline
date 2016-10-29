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
            var email = this.$('input[name="email"]').val();
            var password = this.$('input[name="password"]').val();
            var rpassword = this.$('input[name="rpassword"]').val();

            APP.socket.emit('anonymous action', 'register', {
                username: username,
                email: email,
                password: password,
                rpassword: rpassword
            });

            var self = this;

            APP.socket.once('anonymous action', function (data) {
                if (data.success) BB.history.navigate('auth/login', {trigger: true});
                else {
                    if (data.errorCode === 1) self.showErrorMessage('Corrige el valor en los campos con error');
                    else {
                        //
                    }

                    self.addErrorClasses(data.attrsWithError);
                }
            });
        },
        showErrorMessage: function (message) {
            this.$('#error-message').text(message);
        },
        addErrorClasses: function (attrsWithError) {
            var self = this;

            _.each(attrsWithError, function (attrWithError) {
                self.$('#' + attrWithError.name + '-input-container > input').addClass('has-error');
            });
        },
        removeErrorClasses: function () {
            this.$('.has-error').removeClass('.has-error');
        }
    });
});

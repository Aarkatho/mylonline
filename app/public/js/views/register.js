define(['backbone'], function (BB) {
    return BB.View.extend({
        el: '#register-form',
        events: {
            'submit': 'register',
            'change .error': 'removeErrorClass'
        },
        initialize: function () {
            this.$('input[name="username"]').focus();
        },
        register: function (event) {
            event.preventDefault();

            if (this.$('#auth-error-message').is(':visible')) {
                this.$('#auth-error-message').hide();
                if (this.$('input:not([type="submit"])').hasClass('error')) this.$('input:not([type="submit"])').removeClass('error');
            }

            APP.socket.emit('anonymous action', 'register', {
                username: this.$('input[name="username"]').val(),
                email: this.$('input[name="email"]').val(),
                password: this.$('input[name="password"]').val(),
                rpassword: this.$('input[name="rpassword"]').val()
            });

            var self = this;

            APP.socket.once('anonymous action', function (data) {
                if (data.success) BB.history.navigate('auth/login', {trigger: true});
                else {
                    if (data.errorCode === 1) self.$('#auth-error-message').text('Corrige el valor en los campos marcados.');
                    else {
                        if (data.attrsWithError.username && data.attrsWithError.email) {
                            self.$('#auth-error-message').text('Nombre de usuario y email no disponibles.');
                        } else if (data.attrsWithError.username && !data.attrsWithError.email) {
                            self.$('#auth-error-message').text('Nombre de usuario no disponible.');
                        } else self.$('#auth-error-message').text('Email no disponible.');
                    }

                    self.$('#auth-error-message').show();
                    if (data.attrsWithError.username) self.$('input[name="username"]').addClass('error');
                    if (data.attrsWithError.email) self.$('input[name="email"]').addClass('error');
                    if (data.attrsWithError.password) self.$('input[name="password"]').addClass('error');
                    if (data.attrsWithError.rpassword) self.$('input[name="rpassword"]').addClass('error');
                }
            });
        },
        removeErrorClass: function (event) {
            BB.$(event.target).removeClass('error');
        }
    });
});

define(['backbone', 'jquery', 'hgn!templates/pages/sections/auth-register'], function (BB, $, authRegisterTemplate) {
    return BB.View.extend({
        id: 'auth-register',
        initialize: function () {},
        render: function () {
            var deferred = BB.$.Deferred();

            var markup = authRegisterTemplate({});

            this.$el.html(markup);
            this.$el.appendTo('#auth-section');
            deferred.resolve();
            return deferred.promise();
        }
    });
});

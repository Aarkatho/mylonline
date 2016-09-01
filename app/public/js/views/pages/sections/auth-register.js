define(['backbone', 'jquery', 'hgn!templates/pages/sections/auth-register'], function (BB, $, authRegisterTemplate) {
    return BB.View.extend({
        id: 'auth-register',
        className: 'auth-section section',
        initialize: function () {},
        render: function () {
            var deferred = BB.$.Deferred();

            var markup = authRegisterTemplate({});

            this.$el.html(markup);
            this.$el.appendTo('#auth-section-container');
            deferred.resolve();
            return deferred.promise();
        }
    });
});

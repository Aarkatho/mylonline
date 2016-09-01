define(['backbone', 'jquery', 'hgn!templates/pages/sections/auth-login'], function (BB, $, authLoginTemplate) {
    return BB.View.extend({
        id: 'auth-login',
        className: 'auth-section section',
        initialize: function () {},
        render: function () {
            var deferred = BB.$.Deferred();

            var markup = authLoginTemplate({});

            this.$el.html(markup);
            this.$el.appendTo('#auth-section-container');
            deferred.resolve();
            return deferred.promise();
        }
    });
});

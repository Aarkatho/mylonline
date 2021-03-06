define(['backbone', 'hgn!templates/pages/auth'], function (BB, authTemplate) {
    return BB.View.extend({
        id: 'auth',
        className: 'page',
        initialize: function () {},
        render: function () {
            var deferred = BB.$.Deferred();

            var markup = authTemplate({});

            this.$el.html(markup);
            this.$el.appendTo('#page-container');
            deferred.resolve();
            return deferred.promise();
        }
    });
});

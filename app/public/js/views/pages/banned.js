define(['backbone', 'hgn!templates/pages/banned'], function (BB, bannedTemplate) {
    return BB.View.extend({
        id: 'banned',
        className: 'page',
        initialize: function () {},
        render: function () {
            var deferred = BB.$.Deferred();

            var markup = bannedTemplate({});

            this.$el.html(markup);
            this.$el.appendTo('#page-container');
            deferred.resolve();
            return deferred.promise();
        }
    });
});

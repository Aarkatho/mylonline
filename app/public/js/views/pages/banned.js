define(['backbone', 'jquery', 'hgn!templates/pages/banned'], function (BB, $, bannedTemplate) {
    return BB.View.extend({
        id: 'banned',
        initialize: function () {},
        render: function () {
            var deferred = BB.$.Deferred();

            var markup = bannedTemplate({});
            this.$el.html(markup);
            this.$el.appendTo('#page');
            deferred.resolve();

            return deferred.promise();
        }
    });
});

define(['backbone', 'jquery', 'hgn!templates/pages/sections/dashboard-shop'], function (BB, $, shopTemplate) {
	return BB.View.extend({
		el: '#dashboard-section',
		initialize: function () {
			//
		},
		render: function (callback) {
			var markup = shopTemplate({});
			this.$el.html(markup);
			callback();
		}
	});
});

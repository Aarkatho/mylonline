define(['backbone', 'jquery', 'hgn!templates/pages/sections/dashboard-shop'], function (BB, $, shopTemplate) {
	return BB.View.extend({
		initialize: function () {
			//
		},
		render: function (callback) {
			var markup = shopTemplate({});
			this.setElement('#dashboard-section');
			this.$el.html(markup);
			callback();
		}
	});
});

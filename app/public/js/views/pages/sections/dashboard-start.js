define(['backbone', 'jquery', 'hgn!templates/pages/sections/dashboard-start'], function (BB, $, startTemplate) {
	return BB.View.extend({
		el: '#dashboard-section',
		initialize: function () {
			//
		},
		render: function (callback) {
			var markup = startTemplate({});
			console.log('rendering dashboard-start.js');
			console.log(markup);
			this.$el.html(markup);
			callback();
		}
	});
});

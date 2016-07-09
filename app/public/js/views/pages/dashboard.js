define(['backbone', 'jquery', 'hgn!templates/dashboard'], function (BB, $, dashboardTemplate) {
	return BB.View.extend({
		el: '#page-container',
		initialize: function () {
			console.log('inicializando views/pages/dashboard.js');
		},
		render: function () {
			console.log('rendering');
			var markup = dashboardTemplate({
				name: 'Aarkatho'
			});
			this.$el.append(markup);
		}
	});
});

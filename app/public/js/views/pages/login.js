define(['backbone', 'jquery', 'hgn!templates/login'], function (BB, $, loginTemplate) {
	return BB.View.extend({
		el: '#page-container',
		loaded: true,
		initialize: function () {
			console.log('inicializando views/pages/login.js');
		},
		render: function () {
			console.log('rendering');
			var markup = loginTemplate({
				//
			});
			this.$el.append(markup);
		}
	});
});

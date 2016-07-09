define(['backbone', 'jquery', 'hgn!templates/login'], function (BB, $, loginTemplate) {
	return BB.View.extend({
		el: '#page-container',
		initialize: function () {
			console.log('inicializando views/pages/login.js');
		},
		render: function (callback) {
			console.log('rendering');
			var markup = loginTemplate({
				name: 'Aarkatho'
			});
			this.$el.append(markup);
			callback();
		}
	});
});

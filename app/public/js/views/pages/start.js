define(['backbone', 'jquery', 'hgn!templates/start'], function (BB, $, startTemplate) {
	return BB.View.extend({
		el: '#page-container',
		initialize: function () {
			console.log('inicializando views/pages/start.js');
		},
		render: function () {
			console.log('rendering');
			var markup = startTemplate({
				//
			});
			this.$el.append(markup);
		}
	});
});

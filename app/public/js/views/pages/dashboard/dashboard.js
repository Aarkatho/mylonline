define(['backbone', 'jquery', 'models/user', 'hgn!templates/dashboard'], function (BB, $, UserModel, dashboardTemplate) {
	return BB.View.extend({
		el: '#page-container',
		userModel: null,
		initialize: function () {
			this.userModel = new UserModel();
		},
		render: function (callback) {
			var self = this;
			this.userModel.fetch({
				success: function (model, response, options) {
					var markup = dashboardTemplate({
						name: response.user.name,
						password: response.user.password
					});
					self.$el.html(markup);
					callback();
				},
				error: function (model, response, options) {
					//
				}
			});
		}
	});
});

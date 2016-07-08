define(['backbone', 'jquery'], function (BB, $) {
	return BB.Router.extend({
		routes: {
			'login': 'login',
			'start': 'start'
		},
		initialize: function () {
			BB.history.start();
			var isAuthenticated = true;
			isAuthenticated ? this.navigate('start', {trigger: true}) : this.navigate('login', {trigger: true});
		},
		execute: function (callback, args, name) {
			callback();
		},
		login: function () {
			console.log('login handler');
		},
		start: function () {
			console.log('start handler');
		}
	});
});

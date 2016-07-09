define(['backbone', 'jquery'], function (BB, $) {
	var Router = BB.Router.extend({
		routes: {
			'login': 'showLoginPage',
			'dashboard': 'showDashboardPage'
		},
		execute: function (callback, args, name) {
			if(callback) callback();
		}
	});

	return {
		initialize: function () {
			var router = new Router(), pages = {
				login: {
					loaded: false
				},
				dashboard: {
					loaded: false,
					sections: {
						start: {
							loaded: false
						}
					}
				},
				loadPage: function (page) {
					if(this[page].loaded) {
						//
					}
					else {
						var self = this;
						requirejs(['views/pages/' + page], function (PageView) {
							new PageView().render();
							self[page].loaded = true;
						});
					}
				}
			};

			router.on('route:showLoginPage', function () {
				pages.loadPage('login');
			});

			router.on('route:showDashboardPage', function () {
				pages.loadPage('dashboard');
			});

			BB.history.start();
			var isAuthenticated = false;
			isAuthenticated ? router.navigate('dashboard', {trigger: true}) : router.navigate('login', {trigger: true});
		}
	};
});

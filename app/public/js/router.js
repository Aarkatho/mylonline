define(['backbone', 'jquery'], function (BB, $) {
	return BB.Router.extend({
		routes: {
			'login': 'showLoginPage',
			'dashboard': 'showDashboardPage',
			'dashboard/:section': 'showDashboardSection'
		},
		initialize: function () {
			var pages = {
				login: {
					view: {
						url: 'views/pages/login',
						isLoaded: false
					}
				},
				dashboard: {
					view: {
						url: 'views/pages/dashboard',
						isLoaded: false
					},
					sections: {
						start: {
							view: {
								url: 'views/pages/sections/dashboard-start',
								isLoaded: false
							}
						},
						shop: {
							view: {
								url: 'views/pages/sections/dashboard-start',
								isLoaded: false
							}
						}
					}
				},
				show: function (target, callback) {
					if (target.view.isLoaded) {
						target.view.instance.render(function () {});
					} else {
						this.loadView(target, function () {
							if (callback) callback();
						});
					}
				},
				loadView: function (target, callback) {
					requirejs([target.view.url], function (targetView) {
						var instance = new targetView();

						instance.render(function () {
							target.view.isLoaded = true;
							target.view.instance = instance;
							callback();
						});
					});
				}
			};

			this.on('route:showLoginPage', function () {
				pages.show(pages.login);
			});

			this.on('route:showDashboardPage', function () {
				var self = this;
				pages.show(pages.dashboard, function () {
					self.navigate('dashboard/start', {trigger: true});
				});
			});

			this.on('route:showDashboardSection', function (section) {
				pages.show(pages.dashboard.sections[section]);
			});

			BB.history.start();
			this.navigate('dashboard', {trigger: true});
		},
		execute: function (callback, args, name) {
			if (callback) callback();
		}
	});
});

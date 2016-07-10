define(['backbone', 'jquery'], function (BB, $) {
	return BB.Router.extend({
		routes: {
			'login': 'showLoginPage',
			'dashboard': 'showDashboardPage'
		},
		initialize: function () {
			var pages = {
				login: {
					viewUrl: 'views/pages/login/login',
					isLoaded: false
				},
				dashboard: {
					viewUrl: 'views/pages/dashboard/dashboard',
					isLoaded: false
				},
				showPage: function (page) {
					if (page.isLoaded) {
						page.viewInstance.render(function () {
							// quitar ajax loader de pagina (modal)
						});
					} else {
						this.loadPage(page);
					}
				},
				loadPage: function (page) {
					requirejs([page.viewUrl], function (PageView) {
						var viewInstance = new PageView();

						viewInstance.render(function () {
							page.isLoaded = true;
							page.viewInstance = viewInstance;
							// quitar ajax loader de pagina (body)
						});
					});
				}
			};

			this.on('route:showLoginPage', function () {
				pages.showPage(pages.login);
			});

			this.on('route:showDashboardPage', function () {
				pages.showPage(pages.dashboard);
			});

			BB.history.start();
			this.navigate('dashboard', {trigger: true});
		},
		execute: function (callback, args, name) {
			if (callback) callback();
		}
	});
});

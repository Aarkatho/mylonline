define(['backbone', 'jquery'], function (BB, $) {
	return BB.Router.extend({
		routes: {
			'login': 'showLoginPage',
			'dashboard': 'showDashboardPage'
		},
		initialize: function () {
			var loadedPages = {};

			function loadPage (pageName) {
				if (loadedPages.hasOwnProperty(pageName)) {
					loadedPages[pageName].render(function () {
						// quitar ajax loader de actualizar pagina (tipo modal)
					});
				} else {
					requirejs(['views/pages/' + pageName + '/' + pageName], function (PageView) {
						var pageView = new PageView();

						pageView.render(function () {
							loadedPages[pageName] = pageView;
							// quitar ajax loader de pagina
						});
					});
				}
			}

			this.on('route:showLoginPage', function () {
				loadPage('login');
			});

			this.on('route:showDashboardPage', function () {
				loadPage('dashboard');
			});

			BB.history.start();
			this.navigate('dashboard', {trigger: true});
		},
		execute: function (callback, args, name) {
			if (callback) callback();
		}
	});
});

define(['backbone', 'jquery'], function (BB, $) {
	var Router = BB.Router.extend({
		routes: {
			'login': 'showLoginPage',
			'start': 'showStartPage'
		},
		execute: function (callback, args, name) {
			console.log('execute');
			if(callback) callback();
		}
	});

	return {
		initialize: function () {
			var router = new Router(), loadedPages = [];

			router.on('route:showLoginPage', function () {
				console.log('show login page');
				if($.inArray('login', loadedPages) != -1) {
					console.log('login page ya estaba cargada');
				}
				else {
					requirejs(['views/pages/login'], function (LoginPageView) {
						new LoginPageView().render();
						loadedPages.push('login');
					});
				}
			});

			router.on('route:showStartPage', function () {
				console.log('show start page');
				if($.inArray('start', loadedPages) != -1) {
					console.log('start page ya estaba cargada');
				}
				else {
					requirejs(['views/pages/start'], function (StartPageView) {
						new StartPageView().render();
						loadedPages.push('start');
					});
				}
			});

			BB.history.start();
			false ? router.navigate('start', {trigger: true}) : router.navigate('login', {trigger: true});
		}
	};
});

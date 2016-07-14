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
                        url: 'pages/login'
                    }
                },
                dashboard: {
                    view: {
                        url: 'pages/dashboard'
                    },
                    sections: {
                        start: {
                            view: {
                                url: 'pages/sections/dashboard-start'
                            }
                        },
                        shop: {
                            view: {
                                url: 'pages/sections/dashboard-shop'
                            }
                        }
                    }
                }
            };

            function showPageOrSection (target, callback) {
                if (target.view.isLoaded) {
                    console.log('ya estaba loaded');
                    renderView(target, function () {
                        if (callback) callback();
                    });
                } else {
                    console.log('no estaba loaded - ' + target.view.url);
                    loadView(target, function () {
                        if (callback) callback();
                    });
                }
            }

            function loadView (target, callback) {
                requirejs(['views/' + target.view.url], function (TargetView) {
                    var instance = new TargetView();

                    instance.render(function () {
                        console.log('renderizando - ' + target.view.url);
                        target.view.isLoaded = true;
                        target.view.instance = instance;
                        callback();
                    });
                });
            }

            function renderView (target, callback) {
                target.view.instance.render(function () {});
            }

            this.on('route:showLoginPage', function () {
                showPageOrSection(pages.login);
            });

            this.on('route:showDashboardPage', function () {
                var self = this;
                showPageOrSection(pages.dashboard, function () {
                    self.navigate('dashboard/start', {trigger: true});
                });
            });

            this.on('route:showDashboardSection', function (section) {
                showPageOrSection(pages.dashboard.sections[section]);
            });

            history.replaceState({}, '', '/');
            BB.history.start();
            this.navigate('dashboard', {trigger: true});
        },
        execute: function (callback, args, name) {
            if (callback) callback();
        }
    });
});

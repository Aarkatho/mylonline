define(['backbone', 'jquery'], function (BB, $) {
    return BB.Router.extend({
        routes: {
            'auth': 'showAuthPage',
            'auth/:section': 'showAuthSection',
            'dashboard': 'showDashboardPage',
            'dashboard/:section': 'showDashboardSection',
            'banned': 'showBannedPage'
        },
        initialize: function () {
            console.log('ROUTER CARGADO: router.js');

            var pages = {
                auth: {
                    view: {
                        url: 'pages/auth'
                    },
                    sections: {
                        login: {
                            view: {
                                url: 'pages/sections/auth-login'
                            }
                        },
                        register: {
                            view: {
                                url: 'pages/sections/auth-register'
                            }
                        }
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
                },
                banned: {
                    view: {
                        url: 'pages/banned'
                    }
                }
            };

            function showPage(page, callback) {
                if (page.view.isLoaded) {
                    renderView(page, function () {
                        if (callback) callback();
                    });
                } else {
                    loadView(page, function () {
                        if (callback) callback();
                    });
                }
            }

            function showSection(section, callback) {
                if (section.view.isLoaded) {
                    renderView(section, function () {
                        if (callback) callback();
                    });
                } else {
                    loadView(section, function () {
                        if (callback) callback();
                    });
                }
            }

            function loadView (target, callback) {
                requirejs(['views/' + target.view.url], function (TargetView) {
                    var instance = new TargetView();

                    instance.render(function () {
                        console.log('ROUTER: la vista "' + target.view.url + '" ha sido cargada y renderizada');
                        target.view.isLoaded = true;
                        target.view.instance = instance;
                        callback();
                    });
                });
            }

            function renderView (target, callback) {
                target.view.instance.render(function () {
                    console.log('ROUTER: la vista "' + target.view.url + '" ha sido renderizada nuevamente');
                });
            }

            this.on('route:showAuthPage', function () {
                var self = this;
                showPage(pages.auth, function () {
                    self.navigate('auth/login', {trigger: true});
                });
            });

            this.on('route:showAuthSection', function (section) {
                showSection(pages.auth.sections[section]);
            });

            this.on('route:showDashboardPage', function () {
                var self = this;
                showPage(pages.dashboard, function () {
                    self.navigate('dashboard/start', {trigger: true});
                });
            });

            this.on('route:showDashboardSection', function (section) {
                showSection(pages.dashboard.sections[section]);
            });

            this.on('route:showBannedPage', function () {
                showPage(pages.banned);
            });

            history.replaceState({}, '', '/');
            BB.history.start();
            this.navigate('auth', {trigger: true});
        },
        execute: function (callback, args, name) {
            if (callback) callback();
        }
    });
});

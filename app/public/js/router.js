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

            function showPageOrSection (target, callback) {
                if (target.view.isLoaded) {
                    console.log('ROUTER: la pagina ya estaba cargada (' + target.view.url + ')');
                    renderView(target, function () {
                        if (callback) callback();
                    });
                } else {
                    console.log('ROUTER: la pagina "' + target.view.url + '" ha sido cargada');
                    loadView(target, function () {
                        if (callback) callback();
                    });
                }
            }

            function loadView (target, callback) {
                requirejs(['views/' + target.view.url], function (TargetView) {
                    var instance = new TargetView();

                    instance.render(function () {
                        console.log('ROUTER: renderizando la siguiente pagina: ' + target.view.url);
                        target.view.isLoaded = true;
                        target.view.instance = instance;
                        callback();
                    });
                });
            }

            function renderView (target, callback) {
                target.view.instance.render(function () {});
            }

            this.on('route:showAuthPage', function () {
                var self = this;
                showPageOrSection(pages.auth, function () {
                    self.navigate('auth/login', {trigger: true});
                });
            });

            this.on('route:showAuthSection', function (section) {
                showPageOrSection(pages.auth.sections[section]);
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

            this.on('route:showBannedPage', function () {
                showPageOrSection(pages.banned);
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

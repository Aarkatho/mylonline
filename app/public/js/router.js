define(['backbone'], function (BB) {
    var isLoggedIn = false;
    var isBanned = false;

    return BB.Router.extend({
        routes: {
            'auth(/:section)': 'auth',
            'dashboard(/:section)': 'dashboard',
            'banned': 'banned'
        },
        pageManager: {
            currentPage: null,
            showPage: function (pageName, callback) {
                if (this.currentPage) this.currentPage.view.remove();

                var self = this;
                requirejs(['views/pages/' + pageName], function (PageView) {
                    var pageView = new PageView();

                    pageView.render(function () {
                        self.currentPage = {name: pageName, view: pageView};
                        pageView.$el.show();
                        BB.$('#page-loader').fadeOut(350);
                        if (callback) callback();
                    });
                });
            }
        },
        initialize: function () {
            history.replaceState({}, '', '/');
            BB.history.start({pushState: false});
            this.navigate('dashboard', {trigger: true});
        },
        execute: function (callback, args, name) {
            if (isLoggedIn) {
                if (isBanned && name !== 'banned') {
                    this.navigate('banned', {trigger: true});
                    return false;
                }
            } else {
                if (name !== 'auth') {
                    this.navigate('auth', {trigger: true});
                    return false;
                }
            }

            if (callback) callback.apply(this, args);
        },
        auth: function (section) {
            if (section) {
                this.pageManager.currentPage.view.switchSection(section);
            } else {
                var self = this;
                this.pageManager.showPage('auth', function () {
                    self.navigate('auth/login', {trigger: true});
                });
            }
        },
        dashboard: function (section) {
            if (section) {
                this.pageManager.currentPage.view.switchSection(section);
            } else {
                var self = this;
                this.pageManager.showPage('dashboard', function () {
                    self.navigate('dashboard/start', {trigger: true});
                });
            }
        },
        banned: function () {
            this.pageManager.showPage('banned');
        }
    });
});

/* Por fixear: Mostrar loader con fadeIn (350 ms) y en su callback, continuar con la operacion (.showPage()),
               Si se visita directamente una seccion (de auth/login a dashboard/start),
               hacer que redireccione a la principal y luego secundaria
*/
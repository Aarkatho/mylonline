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
            switchPage: function (pageName, callback) {
                var self = this;
                var deferred = BB.$.Deferred();

                if (this.currentPage) {
                    BB.$('#page-loader').fadeIn('fast', function () {
                        self.currentPage.view.remove();
                        deferred.resolve();
                    });
                } else deferred.resolve();

                deferred.done(function () {
                    requirejs(['views/pages/' + pageName], function (PageView) {
                        var pageView = new PageView();

                        pageView.render(function () {
                            self.currentPage = {name: pageName, view: pageView};
                            pageView.$el.show();
                            BB.$('#page-loader').fadeOut('slow');
                            if (callback) callback();
                        });
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
            if (section) this.pageManager.currentPage.view.switchSection(section);
            else {
                var self = this;

                this.pageManager.switchPage('auth', function () {
                    self.navigate('auth/login', {trigger: true});
                });
            }
        },
        dashboard: function (section) {
            if (section) this.pageManager.currentPage.view.switchSection(section);
            else {
                var self = this;

                this.pageManager.switchPage('dashboard', function () {
                    self.navigate('dashboard/start', {trigger: true});
                });
            }
        },
        banned: function () {
            this.pageManager.switchPage('banned');
        }
    });
});

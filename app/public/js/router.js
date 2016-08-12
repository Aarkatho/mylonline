define(['backbone'], function (BB) {
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

                        pageView.render().then(
                            function () {
                                self.currentPage = {name: pageName, view: pageView};
                                pageView.$el.show();
                                BB.$('#page-loader').fadeOut();
                                if (callback) callback();
                            },
                            function () {
                                alert('Error al renderizar la pagina: ' + pageName);
                            }
                        );
                    });
                });
            },
            switchSection: function (pageName, sectionName) {
                pageName === this.currentPage.name ?
                    this.currentPage.view.switchSection(sectionName) :
                    BB.history.navigate(pageName, {trigger: true});
            }
        },
        initialize: function () {
            history.replaceState({}, '', '/');
            BB.history.start({pushState: false});
            this.navigate('dashboard', {trigger: true});
        },
        execute: function (callback, args, name) {
            if (callback) callback.apply(this, args);
        },
        auth: function (section) {
            if (section) this.pageManager.switchSection('auth', section);
            else {
                this.pageManager.switchPage('auth', function () {
                    BB.history.navigate('auth/login', {trigger: true});
                });
            }
        },
        dashboard: function (section) {
            if (section) this.pageManager.switchSection('dashboard', section);
            else {
                this.pageManager.switchPage('dashboard', function () {
                    BB.history.navigate('dashboard/start', {trigger: true});
                });
            }
        },
        banned: function () {
            this.pageManager.switchPage('banned');
        }
    });
});

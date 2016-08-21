define(['backbone'], function (BB) {
    var Router = BB.Router.extend({
        routes: {
            'auth(/:section)': 'auth',
            'dashboard(/:section)': 'dashboard',
            'banned': 'banned'
        },
        pageManager: {
            currentPage: null,
            currentPageSection: null,
            switchPage: function (pageName, callback) {
                var self = this;
                var deferred = BB.$.Deferred();

                if (this.currentPage) {
                    BB.$('#page-loader').fadeIn('fast', function () {
                        if (self.currentPageSection) self.remove(self.currentPageSection);
                        self.remove(self.currentPage);
                        deferred.resolve();
                    });
                } else deferred.resolve();

                deferred.done(function () {
                    requirejs(['views/pages/' + pageName], function (PageView) {
                        var pageView = new PageView();

                        pageView.render().then(
                            function () {
                                requirejs(['apps/' + pageName], function (pageApp) {
                                    pageApp.initialize();

                                    self.currentPage = {
                                        name: pageName,
                                        view: pageView,
                                        subViews: pageApp.views
                                    };

                                    pageView.$el.show();
                                    BB.$('#page-loader').fadeOut();
                                    if (callback) callback();
                                });
                            },
                            function () {}
                        );
                    });
                });
            },
            switchPageSection: function (pageName, sectionName) {
                if (pageName === this.currentPage.name) {
                    var self = this;
                    var deferred = BB.$.Deferred();

                    if (this.currentPageSection) {
                        this.currentPageSection.view.$el.fadeOut('fast', function () {
                            self.remove(self.currentPageSection);
                            deferred.resolve();
                        });
                    } else deferred.resolve();

                    deferred.done(function () {
                        BB.$('#section-loader').fadeIn('fast', function () {
                            requirejs(['views/pages/sections/' + pageName + '-' + sectionName],
                                function (SectionView) {
                                    var sectionView = new SectionView();

                                    sectionView.render().then(
                                        function () {
                                            requirejs(['apps/' + pageName + '-' + sectionName], function (sectionApp) {
                                                sectionApp.initialize();

                                                self.currentPageSection = {
                                                    name: sectionName,
                                                    view: sectionView,
                                                    subViews: sectionApp.views
                                                };

                                                BB.$('#section-loader').fadeOut('fast', function () {
                                                    sectionView.$el.fadeIn('fast');
                                                });
                                            });
                                        },
                                        function () {}
                                    );
                                },
                                function () {}
                            );
                        });
                    });
                } else BB.history.navigate(pageName, {trigger: true});
            },
            remove: function (target) {
                if (!_.isEmpty(target.subViews)) {
                    _.each(target.subViews, function (subView) {
                        subView.remove();
                    });
                }

                target.view.remove();
                target = null;
            }
        },
        initialize: function () {
            history.replaceState({}, '', '/');
            BB.history.start({pushState: false});
            this.navigate('auth', {trigger: true});
        },
        execute: function (callback, args, name) {
            if (currentUser.get('isLoggedIn')) {
                if (name === 'auth') return false;

                if (name === 'banned') {
                    if (!currentUser.get('isBanned')) return false;
                } else {
                    if (currentUser.get('isBanned')) return false;
                }
            } else {
                if (name !== 'auth') return false;
            }

            if (callback) callback.apply(this, args);
        },
        auth: function (section) {
            if (section) this.pageManager.switchPageSection('auth', section);
            else {
                this.pageManager.switchPage('auth', function () {
                    BB.history.navigate('auth/login', {trigger: true});
                });
            }
        },
        dashboard: function (section) {
            if (section) this.pageManager.switchPageSection('dashboard', section);
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

    return new Router();
});

define(['backbone'], function (BB) {
    return BB.Router.extend({
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
                        if (self.currentPageSection) self.currentPageSection.view.remove();
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
            switchPageSection: function (pageName, sectionName) {
                if (pageName === this.currentPage.name) {
                    var self = this;
                    var deferred = BB.$.Deferred();

                    if (this.currentPageSection) {
                        this.currentPageSection.view.$el.fadeOut('fast', function () {
                            self.currentPageSection.view.remove();
                            deferred.resolve();
                        });
                    } else deferred.resolve();

                    deferred.done(function () {
                        BB.$('#section-loader').fadeIn('fast', function () {
                            if (self.currentPageSection) self.currentPageSection.view.remove();

                            requirejs(['views/pages/sections/' + pageName + '-' + sectionName],
                                function (SectionView) {
                                    var sectionView = new SectionView();

                                    sectionView.render().then(
                                        function () {
                                            self.currentPageSection = {name: sectionName, view: sectionView};
                                            BB.$('#section-loader').fadeOut('fast', function () {
                                                sectionView.$el.fadeIn('fast');
                                            });
                                            console.log('se ha renderizado la seccion: ' + sectionName);
                                        },
                                        function () {
                                            alert('Error al renderizar la seccion: ' + sectionName);
                                        }
                                    );
                                },
                                function () {
                                    alert('No existe la seccion: ' + sectionName);
                                }
                            );
                        });
                    });
                } else BB.history.navigate(pageName, {trigger: true});
            }
        },
        initialize: function () {
            history.replaceState({}, '', '/');
            BB.history.start({pushState: false});
            this.navigate('auth', {trigger: true});
        },
        execute: function (callback, args, name) {
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
});

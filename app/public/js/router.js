define(['backbone'], function (BB) {
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
                        self.currentPage = {view: pageView};
                        BB.$('#page-loader').hide();
                        pageView.$el.show();
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
            if (callback) callback.apply(this, args);
        },
        auth: function (section) {
            var self = this;
            section ?
                this.pageManager.currentPage.view.switchSection(section) :
                this.pageManager.showPage('auth', function () {self.navigate('auth/login', {trigger: true})});
        },
        dashboard: function (section) {
            var self = this;
            section ?
                this.pageManager.currentPage.view.switchSection(section) :
                this.pageManager.showPage('dashboard', function () {self.navigate('dashboard/start', {trigger: true})});
        },
        banned: function () {
            this.pageManager.showPage('banned');
        }
    });
});

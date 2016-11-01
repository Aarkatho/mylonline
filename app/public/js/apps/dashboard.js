define(['views/community', 'views/dashboard-chat'], function (CommunityView, DashboardChatView) {
    console.log('APP CARGADA: apps/dashboard.js');

    return {
        initialize: function () {
            this.views = [new CommunityView(), new DashboardChatView()];
        }
    };
});

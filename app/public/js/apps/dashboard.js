define(['views/dashboard-chat'], function (DashboardChatView) {
    console.log('APP CARGADA: apps/dashboard.js');

    return {
        initialize: function () {
            this.views = [new DashboardChatView()];
        }
    };
});

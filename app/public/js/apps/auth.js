define(['views/login', 'views/register'], function (LoginView, RegisterView) {
    console.log('APP CARGADA: apps/auth.js');
    new LoginView();
    new RegisterView();
});

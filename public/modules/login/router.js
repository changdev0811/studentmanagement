angular.module('login').config(function($stateProvider) {
    
     var loginState = {
        name: 'login',
        url: '/login',
        templateUrl : "modules/login/login_form/login_form.html"
      }

    $stateProvider.state(loginState);
 });
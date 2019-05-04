angular.module('iKita').controller('rootCtrl', function ($scope, $window, AuthService, $state, $http, $rootScope) {
    if (AuthService.isloggedInRoot()) {
        $rootScope.isAuth = true;
       
    } else {
        $state.go('login');
    }

});
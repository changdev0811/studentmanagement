angular.module('kita').controller('startUser', function (AuthService, $rootScope, $scope, $http, alertService, $window, $state) {

    if (AuthService.isloggedIn()) {
        $rootScope.isAuth = true;
    } else {
        $state.go('login');
    }

});
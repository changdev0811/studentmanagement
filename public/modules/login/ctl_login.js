angular.module('login').controller('loginCtrl', function ($scope, AuthService, $rootScope) {

    $scope.login = function () {
        AuthService.login($scope.username, $scope.password);  
    }

    $(".chatOnlineService").css({display: 'none'});
});
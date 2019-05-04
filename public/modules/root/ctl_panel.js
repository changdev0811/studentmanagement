angular.module('iKita').controller('panelCtrl', function($rootScope, $scope, AuthService, $window) {

    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    });

    $scope.isLogUser = function () {
        if (AuthService.isloggedIn()) {
            if ($rootScope.decodedToken.usertype == 0) {
                $scope.username = $rootScope.decodedToken.username;
                $scope.kitaname = $rootScope.decodedToken.kitaname;
                $scope.profilPathImg = $rootScope.decodedToken.profilPathImg;
                return true;
            }
        } else {
            return false;
        }
    }

    $scope.isLog = function () {
        if (AuthService.isloggedIn()) {
            $scope.username = $rootScope.decodedToken.username;
            $scope.kitaname = $rootScope.decodedToken.kitaname;
            $scope.profilPathImg = $rootScope.decodedToken.profilPathImg;
            return true;
        } else {
            return false;
        }
    }

    $scope.isLogAdmin = function () {
        if (AuthService.isloggedIn()) {
            if ($rootScope.decodedToken.usertype == 1) {
                $scope.username = $rootScope.decodedToken.username;
                $scope.kitaname = $rootScope.decodedToken.kitaname;
                $scope.profilPathImg = $rootScope.decodedToken.profilPathImg;
                return true;
            }
        } else {
            return false;
        }
    }

    $scope.logout = function(){
        AuthService.logout();
    }
});
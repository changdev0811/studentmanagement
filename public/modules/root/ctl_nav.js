angular.module('iKita').controller('navCtrl', function ($rootScope, $scope, AuthService, $http, $window) {


    $scope.isLogUser = function () {
        if (AuthService.isloggedIn()) {
            if ($rootScope.decodedToken.usertype == 0) {
                $scope.username = $rootScope.decodedToken.first_name;
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
            $scope.username = $rootScope.decodedToken.first_name;
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
                $scope.username = "Admin";
                $scope.kitaname = $rootScope.decodedToken.kitaname;
                $scope.profilPathImg = $rootScope.decodedToken.profilPathImg;
                return true;
            }
        } else {
            return false;
        }
    }


    $scope.logout = function () {
        AuthService.logout();
    }

});
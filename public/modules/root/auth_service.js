angular.module('iKita').service('AuthService', function ($window, $http, $state, $rootScope, alertService) {

    this.getToken = function () {
        return $window.sessionStorage.getItem('token');
    }

    this.setDecodedToken = function(){
        $http({
            method: "GET",
            url: "/user/getToken/" + this.getToken()
        }).then(function mySuccess(response) {
            $rootScope.decodedToken = response.data;
            if($rootScope.decodedToken.usertype == 1){
                $rootScope.refreshedSite = 'start';
                //$(".chatOnlineService").css({display: 'none'});                 
            }else{
                $rootScope.refreshedSite = 'startUser';
                //$(".chatOnlineService").css({display: 'block'});  
            }
            $state.go('sync');
        }, function myError(response) { 
            $state.go('login');
        });
    }

    this.isloggedIn = function () {
        var token = this.getToken();
        var isLog = false;

        if (token) {
            isLog = true;
        } else {
            isLog = false;
        }
        return isLog;
    }

    this.isloggedInRoot = function () {
        var token = this.getToken();
        var isLog = false;

        if (token) {
            isLog = true;
            this.setDecodedToken();
            
        } else {
            isLog = false;
        }
        
        return isLog;
    }

    this.getUserStatus = function () {
        return $http.get('user/status')
            // handle success
            .success(function (data) {
                if (data.status) {
                    user = true;
                } else {
                    user = false;
                }
            })
            // handle error
            .error(function (data) {
                user = false;
            });
    }

    this.login = function (username, password) {

        $http({
            method: "POST",
            url: "/home/login",
            data: { "username": username, "password": password }
        }).then(function mySuccess(response) {
            $window.sessionStorage.token = response.data.token;
            $rootScope.decodedToken = response.data.decodedToken;
            if($rootScope.decodedToken.usertype == 1){
                $rootScope.refreshedSite = 'start';
                //$(".chatOnlineService").css({display: 'none'}); 
            }else{
                $rootScope.refreshedSite = 'startUser';
                //$(".chatOnlineService").css({display: 'block'});   
            }
            $state.go('sync');
            alertService.showNotificationSuccesLogin();
        }, function myError(response) {
            alertService.showNotificationErrorLogin();
        });
    }

    this.logout = function () {
        delete $window.sessionStorage.token;
        delete $window.sessionStorage.decodedToken;
        alertService.showNotificationInfoLogout();
    }

});
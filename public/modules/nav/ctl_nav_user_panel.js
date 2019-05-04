angular.module('iKita').controller('navNotificatinoCtrl', function ($scope, AuthService, $rootScope, $http) {

    var notifications = [];

    $scope.login = function () {
        AuthService.login($scope.username, $scope.password);  
    }

    angular.element(document).ready(function () {
    /*
        This events loaded when the application is starting....
        --- Every efficient methods indeed.
    */
        var unread_count = 0;
        $scope.notifyNum = 0;
        var currentDate = Date();
        
        $http({
            method: "POST",
            url: "feedback/getFeedbackUnread/",
            data : {
                userID : $rootScope.decodedToken.userid,
                userName : $rootScope.decodedToken.username,
                messageRead : false
            }
        }).then(function mySuccess(response) {
            response.data.forEach(element => {
                unread_count++;
                notifications.unshift({
                    'senderName' : element.senderName,
                    'senderImg' : element.senderImg,
                    'fbTitle' : element.feedbackTitle,
                    'fbTime' : diff(moment(currentDate).diff(moment(element.dateTime), "seconds")) ,
                    'messageRead' : element.messageRead
                });
            });

            $scope.notifyNum = unread_count;
            $scope.notifications = notifications;
            
        });
    });

    function diff(val) {
        var hours = Math.floor(val / 3600);
        val = val - hours * 3600;

        var minutes = Math.floor(val / 60);
        var seconds = val - minutes * 60;

        if (minutes == 0) return "vor " + seconds + "s";

        if (hours == 0) return "vor " + minutes + "m " + seconds + "s"

        return "vor " + hours + "h " + minutes + "m " + seconds + "s"
    }

    $rootScope.setBadgeNumber = function(number){
        $scope.notifyNum = number;
    }

});
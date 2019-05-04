angular.module('iKita').controller('NotificationListCtrl', function ($scope, AuthService, $rootScope, $http) {

    var notifications = [];
    var current_notify;

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
        var dataStatus = "";
        
        $http({
            method: "POST",
            url: "feedback/getFeedback/",
            data : {
                userID : $rootScope.decodedToken.userid,
                userName : $rootScope.decodedToken.username
            }
        }).then(function mySuccess(response) {
            response.data.forEach(element => {

                if (element.messageRead == false){
                    unread_count++;
                    dataStatus = "pendiente";
                }else{
                    dataStatus = "pagado"
                }


                notifications.unshift({
                    'senderName' : element.senderName,
                    'senderImg' : element.senderImg,
                    'fbTitle' : element.feedbackTitle,
                    'fbContent' : element.feedbackContent,
                    'fbTime' : (element.dateTime).toString() ,
                    'messageRead' : element.messageRead,
                    "dataStatus" : dataStatus
                });
            });

            $scope.notifyNum = unread_count;
            $scope.notifications = notifications;
            
        });

        $('.star').on('click', function () {
            $(this).toggleClass('star-checked');
        });
    
        $('.ckbox label').on('click', function () {
            $(this).parents('tr').toggleClass('selected');
        });
    
        $('.btn-filter').on('click', function () {
        var $target = $(this).data('target');
            if ($target != 'all') {
                $('.table tr').css('display', 'none');
                $('.table tr[data-status="' + $target + '"]').fadeIn('slow');
            } else {
                $('.table tr').css('display', 'none').fadeIn('slow');
            }
        });

    });

    $scope.itemClick = function(notify){
        current_notify = notify;
        $("#mtitle").text(notify.fbTitle);
        $("#mcontent").text(notify.fbContent);
        $("#myFeedbackModal").modal({ show:true, backdrop: false });
    }


    $scope.onRead = function(){
        unread_count = 0;
        
        notifications.forEach(element => {
            if (element.fbTitle == current_notify.fbTitle && element.messageRead == false){
                element.messageRead = true;
                element.dataStatus = "pagado";

                // We need to send req to database ( about data modification )
                $http({
                    method: "POST",
                    url: "feedback/updateFeedback/",
                    data : {
                        senderName : element.senderName,
                        fb_title : element.fbTitle,
                        fb_Content : element.fbContent
                    }
                });
            }
            if (element.messageRead == false) unread_count++;
        });
        $scope.notifications = notifications;
        $scope.notifyNum = unread_count;
        $rootScope.setBadgeNumber(unread_count);
    }

});
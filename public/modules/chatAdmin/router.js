angular.module('chatAdmin').config(function($stateProvider) {

      var chatAdminView = {
          name : 'ChatView',
          url : '/chat',
          templateUrl : "modules/chatAdmin/chatadmin.html",
      }

      $stateProvider.state(chatAdminView);

}).directive('myChatView', function($timeout){
    var directive = {
        restrict: 'EA',
        templateUrl: 'modules/chatAdmin/chattemplate.html',
        replace: true,
        scope: {
            messages: '=',
            username: '=',
            myUserId: '=',
            inputPlaceholderText: '@',
            submitButtonText: '@',
            title: '@',
            theme: '@',
            submitFunction: '&',
            visible: '=',
            infiniteScroll: '&',
            expandOnNew: '=',
            members: '=',
            recevier:'=', 
            selectedUserID : '=',
            selectedUserName : '=', 
            userAvatorImg : '=', 
            selectUserImage : '='
        },
        link: link,
        controller: chatAdminCtrl,
        controllerAs: 'vm'
    };

    function link(scope, element) {
        if (!scope.inputPlaceholderText) {
            scope.inputPlaceholderText = 'Write your message here...';

        }

        if (!scope.submitButtonText || scope.submitButtonText === '') {
            scope.submitButtonText = 'Send';
        }

        if (!scope.title) {
            scope.title = 'Chat';
        }

        scope.$msgContainer = $('.msg-container-base'); // BS angular $el jQuery lite won't work for scrolling
        scope.$chatInput = $(element).find('.chat-input');

       var elWindow = scope.$msgContainer[0];
    }

    return directive;
});

angular.module('chatAdmin').factory('socket', function ($rootScope) {
    var socket = io.connect('https://app-simplevisor.ch:8082');
    return {
      on: function (eventName, callback) {
        socket.on(eventName, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            callback.apply(socket, args);
          });
        });
      },
      emit: function (eventName, data, callback) {
        socket.emit(eventName, data, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        })
      }
    };
  });

chatAdminCtrl.$inject = ['$scope', '$timeout', '$http', '$rootScope', 'socket'];

function chatAdminCtrl($scope, $timeout, $http, $rootScope, socket) {
    var vm = this;

    vm.isHidden = false;
    vm.messages = $scope.messages;
    vm.username = $scope.username;
    vm.myUserId = $scope.myUserId;
    vm.members = $scope.members;
    vm.userAvatorImg = $scope.userAvatorImg;
    vm.selectUserImage = $scope.selectUserImage;

    //vm.recevier = $scope.recevier;

    vm.inputPlaceholderText = $scope.inputPlaceholderText;
    vm.submitButtonText = $scope.submitButtonText;
    vm.title = $scope.title;
    vm.theme = 'chat-th-' + $scope.theme;
    vm.writingMessage = '';
    vm.panelStyle = {'display': 'block'};
    vm.chatButtonClass= 'fa-angle-double-down icon_minim';

    vm.submitFunction = submitFunction;

    $scope.$watch('visible', function() { // make sure scroll to bottom on visibility change w/ history items
        scrollToBottom();
        $timeout(function() {
            $scope.$chatInput.focus();
        }, 250);
    });
    $scope.$watch('messages.length', function() {
        if (!$scope.historyLoading) scrollToBottom(); // don't scrollToBottom if just loading history
        if ($scope.expandOnNew && vm.isHidden) {
            toggle();
        }
    });

    $scope.selectItem = function(member){
        vm.selectedUserID = member['uID'];
        vm.selectedUserName = member['uUserName'];
        vm.messages = [];

        $http({
            method: "POST",
            url: "chat/getAllMessage/",
            data :{
                sender : vm.username,
                rec : vm.selectedUserName
            }
        }).then(function mySuccess(response) {
            
            for (var i =0; i< response.data.length; i++){
                var doc = response.data[i];

                if (doc.sender == vm.username){
                    vm.messages.push({
                        'username' : doc.sender,
                        'content' : doc.message,
                        'date' : doc.date_time,
                        'imageUrl' : vm.userAvatorImg
                    });
                }
                if (doc.sender == vm.selectedUserName){
                    vm.messages.push({
                        'username' : doc.sender,
                        'content' : doc.message,
                        'date' : doc.date_time,
                        'imageUrl' : member.uImage
                    });
                }
            } 

        });

        scrollToBottom();
    }

    function scrollToBottom() {
        $timeout(function() { // use $timeout so it runs after digest so new height will be included
            $scope.$msgContainer.scrollTop($scope.$msgContainer[0].scrollHeight);
        }, 200, false);
    }

    vm.messages = [];
    vm.username = "";

    function submitFunction() {

      var date_time = new Date().toLocaleString();

      if (vm.writingMessage == ""){
        return;
      }else{
        vm.messages.push({
          'username' : vm.username,
          'content' : vm.writingMessage,
          'date' : date_time, 
          'imageUrl' : vm.userAvatorImg
        });

        socket.emit('send:message', { 
            message : vm.writingMessage,
			senderid: vm.myUserId,
			sendername: vm.username,
			receiverid: vm.selectedUserID,
			receivername: vm.selectedUserName
        });
        
        $http({
            method: 'POST',
            url : '/chat/send',
            data : {
                sender : vm.username,
                recevier : vm.selectedUserName, 
                message : vm.writingMessage,
                date_time : new Date()
            }
        })
        .success(function(data) {
          console.log('Success: ' + data);

          //Empties the object after the POST request is done...
        })
        .error(function(data){
          console.log('Error ' + data);
        });
  
        vm.writingMessage = '';
        scrollToBottom();
      }
      
    }


    vm.members = [];

    angular.element(document).ready(function () {
            $http({
                method: "GET",
                url: "user/getAdminData/"
            }).then(function mySuccess(response) {
                vm.username = response.data.username;
                vm.myUserId = response.data._id;
                vm.userAvatorImg = response.data.profilPathImg;

                socket.emit('user:register', { 
                    userid : vm.myUserId,
                    username : vm.username,
                    isAdmin : true
                });

           //---------Add all user member into list ------------
           $http({
                method: "GET",
                url: "user/getAllUsers/"
            }).then(function mySuccess(res) {
                res.data.forEach(element => {
                    let data ={
                        'uImage' : element.profilPathImg, 
                        'uName': element.first_name + " " + element.last_name, 
                        'uColor' : 'red' ,
                        'uID' : element._id,
                        'uUserName' : element.username
                    };
                    vm.members.push(data);
                });
                
                vm.selectedUserID = vm.members[0]['uID'];
                vm.selectedUserName = vm.members[0]['uUserName'];

                vm.selectUserImage = vm.members[0]['uImage'];

                socket.emit('online:checker', { checker : vm.members });

                vm.messages = [];

                $http({
                    method: "POST",
                    url: "chat/getAllMessage/",
                    data :{
                        sender : vm.username,
                        rec : vm.selectedUserName
                    }
                }).then(function mySuccess(response) {
                    
                    for (var i =0; i< response.data.length; i++){
                        var doc = response.data[i];
                        
                        if (doc.sender == vm.username){
                            vm.messages.push({
                                'username' : doc.sender,
                                'content' : doc.message,
                                'date' : doc.date_time,
                                'imageUrl' : vm.userAvatorImg
                            });
                        }
                        if (doc.sender == vm.selectedUserName){
                            vm.messages.push({
                                'username' : doc.sender,
                                'content' : doc.message,
                                'date' : doc.date_time,
                                'imageUrl' : vm.selectUserImage
                            });
                        }

                    } 
        
                });
        
                scrollToBottom();
            });
        });
    });

    socket.on('init', function (data) {
        $scope.name = data.name;
        $scope.users = data.users;
        console.log(data.name + " ..... " + data.users);
    });
    
    socket.on('send:message', function (message) {
        console.log('send message =>', message);
    });

    socket.on('recive:message', function(data){

        if (data.sendername == vm.selectedUserName){
            var date_time = new Date().toLocaleString();
            vm.messages.push({
                'username' : data.sendername,
                'content' : data.message,
                'date' : date_time,
                'imageUrl' : vm.selectUserImage
            });
            scrollToBottom();
        }else{
            // must show notification alert

            
        }

        
    });

    socket.on('user:online', function(data){
        /*
            userid : vm.myUserId,  
            username : vm.username,

            let data ={ // vm.members structure
                'uImage' : element.profilPathImg, 
                'uName': element.first_name + " " + element.last_name, 
                'uColor' : 'red' ,
                'uID' : element._id,
                'uUserName' : element.username
            };

        */

        vm.members.forEach(element => {
            if (element['uID'] == data.userid){
                element['uColor'] = 'green';
            }
        });
    });

    socket.on('undelivered:message', function(data){
		/*
            message : vm.writingMessage,
			senderid: vm.username,
			sendername: vm.myUserId,
			receiverid: AdminUserID,
			receivername: AdminUserName
		*/
		$http({
            method: 'POST',
            url : '/smsnotify/addNotifyNumber',
            data : {
                senderid : data.senderid,
                sendername : data.sendername, 
                receiverid : data.receiverid,
                receivername : data.receivername
            }
        });

	});

}
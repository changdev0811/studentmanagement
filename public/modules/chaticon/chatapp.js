angular.module('irontec.simpleChat', []);
angular.module('irontec.simpleChat').directive('irontecSimpleChat', ['$timeout', SimpleChat]);

function SimpleChat($timeout) {
	var directive = {
		restrict: 'EA',
		templateUrl: 'modules/chaticon/chaticon.html',
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
			adminname : '=',
			adminid : '=', 
			teachers : '=',
			groupID : '=', 
			kitaID : '=',
			userAvatorUrl : '=',
			adminAvatorUrl : '='
		},
		link: link,
		controller: ChatCtrl,
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
		scope.$msgContainer.bind('scroll', _.throttle(function() {
			var scrollHeight = elWindow.scrollHeight;
			if (elWindow.scrollTop <= 10) {
				scope.historyLoading = true; // disable jump to bottom
				scope.$apply(scope.infiniteScroll);
				$timeout(function() {
					scope.historyLoading = false;
					if (scrollHeight !== elWindow.scrollHeight) // don't scroll down if nothing new added
						scope.$msgContainer.scrollTop(360); // scroll down for loading 4 messages
				}, 150);
			}
		}, 300));
	}

	return directive;
}

angular.module('irontec.simpleChat').factory('socket', function ($rootScope) {
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

ChatCtrl.$inject = ['$scope', '$timeout', '$http', '$rootScope', 'socket'];

function ChatCtrl($scope, $timeout, $http, $rootScope, socket) {
	var vm = this;

	vm.isHidden = false;
	vm.messages = $scope.messages;
	vm.username = $scope.username;
	vm.myUserId = $scope.myUserId;
	vm.teachers = $scope.teachers;
	vm.adminname = $scope.adminname;	// chat admin username
	vm.adminid = $scope.adminid;		// chat admin id
	vm.groupID = $scope.groupID; 
	vm.kitaID = $scope.kitaID;
	vm.userAvatorUrl = $scope.userAvatorUrl;
	vm.adminAvatorUrl = $scope.adminAvatorUrl;

	vm.inputPlaceholderText = $scope.inputPlaceholderText;
	vm.submitButtonText = $scope.submitButtonText;
	vm.title = $scope.title;
	vm.theme = 'chat-th-' + $scope.theme;
	vm.writingMessage = '';
	vm.panelStyle = {'display': 'block'};
	vm.chatButtonClass= 'fa-angle-double-down icon_minim';

	vm.toggle = toggle;
	vm.close = close;
	vm.submitFunction = submitFunction;

	vm.messages = [];
	vm.username = "";
	vm.adminname = "";
	vm.teachers = [
		// {
		// 	userid : "100",
		// 	username : "Alexy",
		// 	uImage : "assets/img/faces/face-2.jpg",
		// 	info :"Alexy Sam",
		// 	badge : 0
		// },
		// {
		// 	userid : "101",
		// 	username : "Rob",
		// 	uImage : "assets/img/faces/face-3.jpg",
		// 	info :"Rob Mack",
		// 	badge : 0
		// },
		// {
		// 	userid : "102",
		// 	username : "Chalton",
		// 	uImage : "assets/img/faces/face-4.jpg",
		// 	info :"Chalton Mike",
		// 	badge : 0
		// },
		// {
		// 	userid : "103",
		// 	username : "Leom",
		// 	uImage : "assets/img/faces/face-5.jpg",
		// 	info :"Leom Des",
		// 	badge : 50
		// },
		// {
		// 	userid : "104",
		// 	username : "Van",
		// 	uImage : "assets/img/faces/face-6.jpg",
		// 	info :"Van desci",
		// 	badge : 0
		// }
	];

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

function scrollToBottom() {
	$timeout(function() { // use $timeout so it runs after digest so new height will be included
		$scope.$msgContainer.scrollTop($scope.$msgContainer[0].scrollHeight);
	}, 200, false);
}

function close() {
	$("#chatview").addClass('ng-hide');
	$(".chatOnlineService").css({display: 'block'});
}

function toggle() {
	if(vm.isHidden) {
		vm.chatButtonClass = 'fa-angle-double-down icon_minim';
		vm.panelStyle = {'display': 'block'};
		vm.isHidden = false;
		scrollToBottom();
	} else {
		vm.chatButtonClass = 'fa-expand icon_minim';
		vm.panelStyle = {'display': 'none'};
		vm.isHidden = true;
	}
}

$scope.teacherClick = function(teacher){
	/*
		teacher structure
			uImage : element.profilPathImg,
			info : element.first_name + " " + element.last_name,
			username : element.username,
			userid : element._id

	*/

	vm.adminid = teacher.userid;
	vm.adminname = teacher.username;
	vm.adminAvatorUrl = teacher.uImage;

	vm.messages = [];

	$http({
		method: "POST",
		url: "chat/getAllMessage/",
		data :{
			sender : vm.username,
			rec : vm.adminname
		}
	}).then(function mySuccess(response) {
		
		for (var i =0; i< response.data.length; i++){
			var doc = response.data[i];
			
			if (doc.sender == vm.username){
				vm.messages.push({
					'username' : doc.sender,
					'content' : doc.message,
					'date' : doc.date_time,
					'imageUrl' : vm.userAvatorUrl
				});
			}
			if (doc.sender == vm.adminname){
				vm.messages.push({
					'username' : doc.sender,
					'content' : doc.message,
					'date' : doc.date_time,
					'imageUrl' : vm.adminAvatorUrl
				});
			}
		} 
		
	});
	
	if (teacher.badge > 0){
		teacher.badge = 0;

		// find notification data in db and delete it.
		// here is the code below :)

		$http({
			method: "POST",
			url: "smsnotify/deleteNotifyNumber/",
			data :{
				sendername : teacher.username,
				receivername : vm.username
			}
		});

	}

	scrollToBottom();
}

$( document ).ready(function() {
		    
});

angular.element(document).ready(function () {

	//console.log("RootScope Data =>", $rootScope.decodedToken);
	vm.adminname = "";

	$http({
		method: "GET",
		url: "user/getUserDataById/" + $rootScope.decodedToken.userid
	}).then(function mySuccess(response) {

		vm.username = response.data.username;
		vm.myUserId = response.data._id;
		vm.groupID = response.data.groupid; 
		vm.kitaID = response.data.kitaid;
		vm.userAvatorUrl = response.data.profilPathImg;

		$http({
			method: "POST",
			url: "user/getAllAdminData/",
			data : {
				kitaid : vm.kitaID			// find out teachers who have same kitaID
			}
		}).then(function onSuccess(res){

			let teacherData;

			res.data.forEach(element => {

				/*
					userid : "102",
					username : "Chalton",
					uImage : "assets/img/faces/face-4.jpg",
					info :"Chalton Mike",
					badge : 0
				*/

				teacherData = {
					uImage : element.profilPathImg,
					info : element.first_name + " " + element.last_name,
					username : element.username,
					userid : element._id,
					badge : 0
				};

				vm.teachers.push(teacherData);
			});

		});

		// $http({
		// 	method: "GET",
		// 	url: "user/getAdminData/"
		// }).then(function mySuccess(response) {
		// 	vm.adminname = response.data.username;
		// 	vm.adminid = response.data._id;
		// });

		vm.messages = [];

		socket.emit('user:register', { 
			userid : vm.myUserId,
			username : vm.username
		});

		/*
		$http({
			method: "POST",
			url: "chat/getMessage/",
			data :{
				name : vm.username
			}
		}).then(function mySuccess(response) {
				
			vm.messages = [];

			socket.emit('user:register', { 
				userid : vm.myUserId,
				username : vm.username
			});

			for (var i =0; i< response.data.length; i++){
				var doc = response.data[i];
				
				if (doc.sender == vm.username){
					vm.messages.push({
						'username' : doc.sender,
						'content' : doc.message,
						'date' : doc.date_time,
						'imageUrl' : vm.userAvatorUrl
					});
				}else{
					vm.messages.push({
						'username' : doc.sender,
						'content' : doc.message,
						'date' : doc.date_time
					});
				}
			}  
			
			scrollToBottom();
		
		});
	*/
	});
});

function submitFunction() {

  var date_time = new Date().toLocaleString();

  if (vm.writingMessage == ""){
	return;
  }else{
	vm.messages.push({
	  'username' : vm.username,
	  'content' : vm.writingMessage,
	  'date' : date_time,
	  'imageUrl' : vm.userAvatorUrl
	});

	console.log("sende Meldung : ");
	
	socket.emit('send:message', { 
		message : vm.writingMessage,
		senderid: vm.myUserId,
		sendername: vm.username,
		receiverid: vm.adminid,
		receivername: vm.adminname
	});

	$http({
		method: 'POST',
		url : '/chat/send',
		data : {
			sender : vm.username,
			recevier : vm.adminname, 
			message : vm.writingMessage,
			date_time : new Date()
		}
	})
	.success(function(data) {
	  console.log('Success: ' + data);
	})
	.error(function(data){
	  console.log('Error ' + data);
	});

	vm.writingMessage = '';
	scrollToBottom();
  }
  
}

socket.on('recive:message', function(data){

	//console.log("sender name => " + data.sendername + " , " + "current admin name => " + vm.adminname);
	if (vm.adminname == ""){
		vm.teachers.forEach(element => {
			if (element.userid == data.senderid){
				element.badge = element.badge + 1;
			}
		});
	}else{
		if (data.sendername == vm.adminname){
			var date_time = new Date().toLocaleString();
	
			vm.messages.push({
				'username' : data.sendername,
				'content' : data.message,
				'date' : date_time,
				'imageUrl' : vm.adminAvatorUrl
			});
	
			scrollToBottom();
		}else{
			// just show notification to the member list
			/*
				-- teachers array structure
	
				userid : "100",
				username : "Alexy",
				uImage : "assets/img/faces/face-2.jpg",
				info :"Alexy Sam",
				badge : 0
	
				-- response data structure
	
				message : vm.writingMessage,
				senderid: vm.username,
				sendername: vm.myUserId,
				receiverid: AdminUserID,
				receivername: AdminUserName
	
			*/
	
			vm.teachers.forEach(element => {
				if (element.userid == data.senderid){
					element.badge = element.badge + 1;
				}
			});
	
		}
	}

	
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

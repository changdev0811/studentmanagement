//root module
var app = angular.module('iKita', ['ui.router', 'ui.calendar', 'user', 'login', 'kita', 'modal', 'calendar', 'irontec.simpleChat', 'chaticon', 'chatAdmin', 'angularCroppie']);
    
//user module
angular.module('user', []);

//login module
angular.module('login', []);

//kita module
angular.module('kita', []);

//Modal module
angular.module('modal', []);

//Calendar module
angular.module('calendar', []);

//Chat App module
angular.module('chaticon', []);
angular.module('chatAdmin', []);

app.run(function ($rootScope, $location, $state, $stateParams, $transitions) {

  $transitions.onSuccess({}, function() {
    window.scrollTo(0, 0);
  });
    
});

app.config(['$locationProvider', function($locationProvider) {
    $locationProvider.hashPrefix('');
    //$locationProvider.html5Mode(true);
}]);
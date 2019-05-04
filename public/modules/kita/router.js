angular.module('kita').config(function($stateProvider) {

    var registerState = {
        name: 'register',
        url: 'kita/register',
        templateUrl : "modules/kita/kita_view/register_view.html"
      }

      var editUserState = {
        name: 'editUser',
        url: 'kita/editUser',
        templateUrl : "modules/kita/kita_view/kita_edituser_view.html"
      }

      var kitaActions = {
        name: 'kitaActions',
        url: 'kita/aktivitäten',
        templateUrl : "modules/kita/kita_view/kita_kitaActions_view.html"
      }

      var hoursUserState = {
        name: 'hoursUser',
        url: 'kita/stundenrapporte',
        templateUrl : "modules/kita/kita_view/kita_hoursUser_view.html"
      }

      $stateProvider.state(registerState);
      $stateProvider.state(editUserState);
      $stateProvider.state(kitaActions);
      $stateProvider.state(hoursUserState);

});
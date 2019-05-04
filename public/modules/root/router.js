var app = angular.module('iKita').config(function ($stateProvider) {

  // ------------------------------------------------------------------
  //Admin Routes
  // ------------------------------------------------------------------

  var startState = {
    name: 'start',
    url: '/start',
    templateUrl: 'modules/start/admin/start_page.html'
  }

  var calendarState = {
    name: 'kalender',
    url: '/kalender',
    templateUrl: "modules/calendar/calendar_view/calendar.html"
  }

  var archivState = {
    name: 'archiv',
    url: '/archiv',
    templateUrl: "modules/kita/archiv_view/archiv_home.html"
  }

  var archivGroupState = {
    name: 'archivGroups',
    url: '/archivGroups',
    templateUrl: "modules/kita/archiv_view/archiv_view_admGroups.html"
  }

  var archivKidsState = {
    name: 'archivKids',
    url: '/archivKids',
    templateUrl: "modules/kita/archiv_view/archiv_view_admKids.html"
  }

  var kitaState = {
    name: 'kita',
    url: '/kita',
    templateUrl: "modules/kita/kita_view/kita_view.html"
  }

  $stateProvider.state(startState);
  $stateProvider.state(calendarState);
  $stateProvider.state(archivState);
  $stateProvider.state(archivGroupState);
  $stateProvider.state(archivKidsState);
  $stateProvider.state(kitaState);


  // ------------------------------------------------------------------
  // Neutral Routes
  // ------------------------------------------------------------------

  var profilState = {
    name: 'profil',
    url: '/profil',
    templateUrl: "modules/user/profil_view/profil_view.html"
  }

  var profilAdminState = {
    name: 'profilAdmin',
    url: '/profilAdmin',
    templateUrl: "modules/user/profil_view/profil_view_admin.html"
  }

  var simpleProgressAdmState = {
    name: 'simpleProgressAdm',
    url: '/simpleProgressAdm',
    templateUrl: "modules/SimpleProcess/simpleProgressAdm_page.html"
  }

  var simpleProgressState = {
    name: 'simpleProgress',
    url: '/simpleProgress',
    templateUrl: "modules/SimpleProcess/simpleProgress_page.html"
  }

  var profilSynState = {
    name: 'sync',
    url: '/sync',
    templateUrl: "modules/root/refreshed_view.html"
  }

  var hilfeState = {
    name: 'hilfe',
    url: '/hilfe',
    templateUrl: "modules/hilfe/hilfe_view.html"
  }

  $stateProvider.state(profilState);
  $stateProvider.state(profilAdminState);
  $stateProvider.state(simpleProgressState);
  $stateProvider.state(simpleProgressAdmState);
  $stateProvider.state(profilSynState);
  $stateProvider.state(hilfeState);



  // ------------------------------------------------------------------
  //User Routes
  // ------------------------------------------------------------------

  var startUserState = {
    name: 'startUser',
    url: '/Start-User',
    templateUrl: 'modules/start/user/start_page.html'
  }

  var calendarUserState = {
    name: 'kalenderUser',
    url: '/Kalender-User',
    templateUrl: "modules/calendar/calendar_view/calendar.html"
  }

  var kitaUserState = {
    name: 'kitaUser',
    url: '/Kita-Info',
    templateUrl: "modules/kita/kita_view/kita_user_view.html"
  }

  var archivStateKid = {
    name: 'archivKid',
    url: '/KitaArchiv',
    templateUrl: "modules/kita/archiv_view/archiv_view_kid.html"
  }

  $stateProvider.state(startUserState);
  $stateProvider.state(calendarUserState);
  $stateProvider.state(kitaUserState);
  $stateProvider.state(archivStateKid);

});
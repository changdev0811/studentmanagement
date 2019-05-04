angular.module('calendar').controller('calendarCtrl', function (AuthService, CalendarService, $rootScope, $scope, $http, alertService, $window, $state, uiCalendarConfig) {

  var eventsByGroup = [];

  $scope.isLogAdmin = function () {
    if (AuthService.isloggedIn()) {
      if ($rootScope.decodedToken.usertype == 1) {
        return true;
      }
    } else {
      return false;
    }
  }

  $(window).resize(function () {
    $scope.windowWidth = $(window).width();
  });

  if (AuthService.isloggedIn()) {
    $rootScope.isAuth = true;
    $scope.mainGroupid = $rootScope.decodedToken.groupid;
    /*config object */
    $scope.eventSources = [];

    $scope.uiConfig = {
      calendar: {
        lang: 'de',
        height: 750,
        editable: CalendarService.isLogAdmin(),
        selectable: CalendarService.isLogAdmin(),
        nowIndicator: true,
        header: {
          left: 'month agendaWeek agendaDay',
          center: 'title',
          right: 'today prev,next'
        },
        dayClick: function (date, jsEvent, view) {
          if (CalendarService.isLogAdmin()) {
            CalendarService.dayClick(date, jsEvent, view, $scope.eventSources);
            console.log($scope.eventSources);

          }
        },
        select: function (start, end, jsEvent, view) {
          if (CalendarService.isLogAdmin()) {
            if (view.name == 'month') {
              if (end.diff(start, "seconds") >= 86401) {
                CalendarService.selectionClick(start, end, jsEvent, view, $scope.eventSources);
              } else {
                //Do nothing (dayclick handler)
              }
            } else {
              CalendarService.selectionClick(start, end, jsEvent, view, $scope.eventSources);
            }
          }
        },
        eventClick: function (event, jsEvent, view) {
          if (CalendarService.isLogAdmin()) {
            CalendarService.eventClick(event, jsEvent, view, $scope.eventSources);
          }
        },
        eventResize: function (event, delta, revertFunc) {
          if (CalendarService.isLogAdmin()) {
            CalendarService.resizeEvent(event, delta, revertFunc);
          }
        },
        eventDrop: function (event, delta, revertFunc, jsEvent, ui, view) {
          if (CalendarService.isLogAdmin()) {
            CalendarService.eventDrop(event, delta, revertFunc, jsEvent, ui, view);

          }
        }
      },
      calendarPad: {
        lang: 'de',
        height: 455,
        editable: CalendarService.isLogAdmin(),
        selectable: CalendarService.isLogAdmin(),
        nowIndicator: true,
        header: {
          left: 'month agendaWeek agendaDay',
          center: 'title',
          right: 'today prev,next'
        },
        dayClick: function (date, jsEvent, view) {
          if (CalendarService.isLogAdmin()) {
            CalendarService.dayClick(date, jsEvent, view, $scope.eventSources);
          }
        },
        select: function (start, end, jsEvent, view) {
          if (CalendarService.isLogAdmin()) {
            if (view.name == 'month') {
              if (end.diff(start, "seconds") >= 86401) {
                CalendarService.selectionClick(start, end, jsEvent, view, $scope.eventSources);
              } else {
                //Do nothing (dayclick handler)
              }
            } else {
              CalendarService.selectionClick(start, end, jsEvent, view, $scope.eventSources);
            }
          }
        },
        eventClick: function (event, jsEvent, view) {

          if (CalendarService.isLogAdmin()) {
            // change the border color just for fun

            CalendarService.eventClick(event, jsEvent, view, $scope.eventSources);
          }
        },
        eventDrop: function (event, delta, revertFunc, jsEvent, ui, view) {
          if (CalendarService.isLogAdmin()) {

          }
        },
        eventResize: function (event, delta, revertFunc) {
          if (CalendarService.isLogAdmin()) {
            CalendarService.resizeEvent(event, delta, revertFunc);
          }
        }
      },
      calendarMobile: {
        lang: 'de',
        height: 400,
        editable: CalendarService.isLogAdmin(),
        selectable: CalendarService.isLogAdmin(),
        nowIndicator: true,
        header: {
          left: 'month agendaDay',
          center: 'title',
          right: 'today prev,next'
        },
        dayClick: function (date, jsEvent, view) {
          {
            if (CalendarService.isLogAdmin()) {
              CalendarService.dayClick(date, jsEvent, view, $scope.eventSources);
            }
          }
        },
        select: function (start, end, jsEvent, view) {
          if (CalendarService.isLogAdmin()) {
            if (view.name == 'month') {
              if (end.diff(start, "seconds") >= 86401) {
                CalendarService.selectionClick(start, end, jsEvent, view, $scope.eventSources);
              } else {
                //Do nothing (dayclick handler)
              }
            } else {
              CalendarService.selectionClick(start, end, jsEvent, view, $scope.eventSources);
            }
          }
        },
        eventClick: function (event, jsEvent, view) {

          if (CalendarService.isLogAdmin()) {
            // change the border color just for fun

            CalendarService.eventClick(event, jsEvent, view, $scope.eventSources);
          }
        },
        eventDrop: $scope.alertOnDrop,
        eventResize: function (event, delta, revertFunc) {
          if (CalendarService.isLogAdmin()) {
            CalendarService.resizeEvent(event, delta, revertFunc);
          }
        }
      }
    };

  } else {
    $state.go('login');
  }

  angular.element(document).ready(function () {

    var i;
    var group;
    if (CalendarService.isLogAdmin()) {
      var kitas = [];
      $http({
        method: "GET",
        url: "kita/group/searchId/" + $rootScope.decodedToken.kitaid,
      }).then(function mySuccess(res) {
        res.data.forEach(element => {
          //element.groupname
          //    console.log("element value =>", element._id);
          kitas.push({ value: element._id, text: element.groupname });
        });

        $scope.selected = kitas[0];    // show default value here for options
        $scope.kitas = kitas;           // pass the data into scope
      });

    } else {
      $http({
        method: "GET",
        url: "calendar/getEventsByGroup/" + $rootScope.decodedToken.groupid
      }).then(function mySuccess(response) {
        if (response.data == null) {
          console.log(response.statusText);
        } else {
          var eventsByGroup = [];

          for (i = 0; i < response.data.length; i++) {
            eventsByGroup.push({
              id: response.data[i]._id,
              title: response.data[i].title,
              color: response.data[i].color,
              textColor: response.data[i].textColor,
              start: response.data[i].start,
              end: response.data[i].end,
              className: response.data[i].groupid
            });
          }
        }

        $rootScope.eventsByGroup = eventsByGroup;
        $scope.eventSources.push({ events: $rootScope.eventsByGroup });
      }, function myError(error) {
        console.log(error.statusText);
      });
    }

    $scope.Groups = [];
    $http({
      method: "GET",
      url: "kita/group/searchId/" + $rootScope.decodedToken.kitaid
    }).then(function mySuccess(response) {
      for (i = 0; i < response.data.length; i++) {
        $scope.Groups.push({ _id: response.data[i]._id, groupname: response.data[i].groupname });
      }
    }, function myError(error) {
      console.log(error.statusText);
    });


  });


  $scope.hasChanged = function () {

    $http({
      method: "GET",
      url: "calendar/getEventsByGroup/" + $scope.selected
    }).then(function mySuccess(response) {
      if (response.data == null) {
        console.log(response.statusText);
      } else {

        for (i = 0; i < response.data.length; i++) {
          eventsByGroup.push({
            id: response.data[i]._id,
            title: response.data[i].title,
            color: response.data[i].color,
            textColor: response.data[i].textColor,
            start: response.data[i].start,
            end: response.data[i].end,
          });
        }
      }

      $scope.eventSources = null;
      $scope.eventSources = [{events:[]}]

      console.log($scope.eventSources);
      $scope.eventSources[0].events = eventsByGroup;
      console.log($scope.eventSources);


    }, function myError(error) {
      console.log(error.statusText);
    });

  };

  $scope.loadEventsGroup = function (groupid) {

    var eventsByGroup = [];
    var i;
    $http({
      method: "GET",
      url: "calendar/getEventsByGroup/" + groupid
    }).then(function mySuccess(response) {
      if (response.data == null) {
        console.log(response.statusText);
      } else {

        for (i = 0; i < response.data.length; i++) {
          eventsByGroup.push({
            id: response.data[i]._id,
            title: response.data[i].title,
            color: response.data[i].color,
            textColor: response.data[i].textColor,
            start: parseInt(response.data[i].start),
            end: parseInt(response.data[i].end),
            className: response.data[i].groupid
          }
          );

        }

        //    console.log(eventsByGroup);
        $rootScope.eventsByGroup = eventsByGroup;
        //     console.log($scope);
        $scope.eventSources = [];
        $scope.eventSources.push({ events: $rootScope.eventsByGroup });

      }

    }, function myError(error) {
      console.log(error.statusText);
    });
  }

});
angular.module('calendar').service('CalendarService', function (AuthService, $window, $http, $state, $rootScope, alertService) {

    var calender_events;
    var current_event_id;
    var current_group_id;

    this.resizeEvent = function (event, delta, revertFunc) {

        var start = moment(event.start).format('YYYY-MM-DD') + "T" + moment(event.start).format('HH:mm') + "+02:00";
        var end = moment(event.end).format('YYYY-MM-DD') + "T" + moment(event.end).format('HH:mm') + "+02:00";

        $http({
            method: "PUT",
            url: "calendar/editEvent",
            data: {
                id: event.id,
                title: event.title,
                start: start + "",
                end: end + "",
                color: event.color,
                textColor: event.textColor,
                userId: $rootScope.decodedToken.userid,
                userName: $rootScope.decodedToken.username,
                groupid: event.className
            }
        }).then(function mySuccess(response) {
           
        });

    };

    this.eventDrop = function(event, delta, revertFunc, jsEvent, ui, view){
        var start = moment(event.start).format('YYYY-MM-DD') + "T" + moment(event.start).format('HH:mm') + "+02:00";
        var end = moment(event.end).format('YYYY-MM-DD') + "T" + moment(event.end).format('HH:mm') + "+02:00";

        $http({
            method: "PUT",
            url: "calendar/editEvent",
            data: {
                id: event.id,
                title: event.title,
                start: start + "",
                end: end + "",
                color: event.color,
                textColor: event.textColor,
                userId: $rootScope.decodedToken.userid,
                userName: $rootScope.decodedToken.username,
                groupid: event.className
            }
        }).then(function mySuccess(response) {
           
        });
    }

    this.dayClick = function (date, jsEvent, view, events) {
        // console.log("Here is start and end =>", start, end);

        $rootScope.modalTitle = "Neues Event hinzufügen";
        $rootScope.modalSuccesBtn = "Bestätigen"
        $rootScope.modalLink = "newEvent";

        var dateComponentStart = date.utc().format('MM/DD/YYYY');
        $rootScope.startDate = new Date(dateComponentStart);
        $rootScope.startTime = '08:00';

        var dateComponentEnd = date.utc().format('MM/DD/YYYY');
        $rootScope.endDate = new Date(dateComponentEnd);
        $rootScope.endTime = '17:00';

        $("#eventTitle").text("");
        $("#eventName").val("");
        $("#bColor").val("#000000");
        $("#fColor").val("#ffffff");

        $('#Modal').modal('show');

        calender_events = events;
    
    }

    this.selectionClick = function (start, end, jsEvent, view, events) {

        // console.log("Here is start and end =>", start, end);

        $rootScope.modalTitle = "Neues Event hinzufügen";
        $rootScope.modalSuccesBtn = "Bestätigen"
        $rootScope.modalLink = "newEvent";

        
        //Start
        var dateComponentStart = moment(start).format('YYYY-MM-DD');
        var timeComponentStart = moment(start).format('HH:mm');
        $rootScope.startDate = new Date(dateComponentStart);
        $rootScope.startTime = timeComponentStart;

        //Ende
        if(moment(end).format('HH:mm') == "00:00"){
            end = moment(end).subtract(1, 'minutes');
        }
        var dateComponentEnd = moment(end).format('YYYY-MM-DD');
        var timeComponentEnd = moment(end).format('HH:mm');
        $rootScope.endDate = new Date(dateComponentEnd);
        $rootScope.endTime = timeComponentEnd;

       
        console.log(dateComponentStart + " " + dateComponentEnd );

        $("#eventTitle").text("");
        $("#eventName").val("");
        $("#bColor").val("#000000");
        $("#fColor").val("#ffffff");

        $('#Modal').modal('show');

        calender_events = events;
        //console.log("selection's events =>", events);

    }

    this.eventClick = function (event, jsEvent, view, events) {
        $rootScope.modalLink = "editEvent";
        $rootScope.modalTitle = "Event bearbeiten";
        $rootScope.modalSuccesBtn = "Bestätigen"
        $rootScope.eventName = event.title;

        calender_events = events;

        //Start
        var dateComponentStart = moment(event.start).format('YYYY-MM-DD');
        var timeComponentStart = moment(event.start).format('HH:mm');
        $rootScope.startDate = new Date(dateComponentStart);
        $rootScope.startTime = timeComponentStart;

        //Ende
        var dateComponentEnd = moment(event.end).format('YYYY-MM-DD');
        var timeComponentEnd = moment(event.end).format('HH:mm');
        $rootScope.endDate = new Date(dateComponentEnd);
        $rootScope.endTime = timeComponentEnd;

        current_event_id = event.id;
        $rootScope.bColor = event.color;
        $rootScope.fColor = event.textColor;

        $rootScope.changeOption(event.className[0]);

        $rootScope.eventName = event.title;

        $("#eventName").val(event.title);
        $("#bColor").val(event.color);
        $("#fColor").val(event.textColor);

        $('#Modal').modal('show');
    }

    $rootScope.newEventConfirm = function () {

        //  console.log(calender_events[0].events);
        var newEvent_groupID;
        var start;
        var end;

        if (calender_events[0].events === undefined) {
            calender_events[0].events = [];
        }

        var length_events = calender_events[0].events.length;



        if ($rootScope.groupSelect === undefined) {  // This mean that groupSelect is array []
            $rootScope.groupSelect = $('#groupNames option:selected').val();
        }


        start = moment($rootScope.startDate).format('YYYY-MM-DD') + "T" + $rootScope.startTime + "+02:00";
        end = moment($rootScope.endDate).format('YYYY-MM-DD') + "T" + $rootScope.endTime + "+02:00";

        if (length_events == 0) {
            calender_events[0].events.push({
                id: 0,
                title: $("#eventName").val(),
                color: $("#bColor").val(),
                textColor: $("#fColor").val(),
                start: start,
                end: end,
                className: $rootScope.groupSelect
            });
        } else {
            calender_events[0].events.push({
                id: calender_events[0].events[length_events - 1].id + 1,
                title: $("#eventName").val(),
                color: $("#bColor").val(),
                textColor: $("#fColor").val(),
                start: start,
                end: end,
                className: $rootScope.groupSelect
            });
        }


        $http({
            method: "POST",
            url: "calendar/newEvent",
            data: {
                title: $("#eventName").val(),
                start: start + "",
                end: end + "",
                color: $("#bColor").val(),
                textColor: $("#fColor").val(),
                userId: $rootScope.decodedToken.userid,
                userName: $rootScope.decodedToken.username,
                groupid: $rootScope.groupSelect
            }
        }).then(function mySuccess(response) {
            $rootScope.refreshedSite = 'kalender';
            $state.go('sync');
        });

    }

    $rootScope.editEventConfirm = function () {
        // this data can be saved into database

        //   console.log("current event id =>", current_event_id, calender_events);
        //   console.log("this is windows object =>", $window );
        //   console.log("status =>", $state);
        var s_Date, e_Date;
        if (calender_events === undefined) {

            console.log($rootScope.eventsByGroup);

            $rootScope.eventsByGroup.forEach(element => {
                if (element.id == current_event_id) {
                    element.title = $rootScope.eventName;
                    element.color = $("#bColor").val();
                    element.textColor = $("#fColor").val();

                    s_Date = moment($rootScope.startDate).format('YYYY-MM-DD') + "T" + $rootScope.startTime + "+02:00";
                    e_Date = moment($rootScope.endDate).format('YYYY-MM-DD') + "T" + $rootScope.endTime + "+02:00";

                    element.start = s_Date;
                    element.end = e_Date;

                    element.className = $rootScope.groupSelect;

                    $http({
                        method: "PUT",
                        url: "calendar/editEvent",
                        data: {
                            id: current_event_id,
                            title: element.title,
                            start: s_Date + "",
                            end: e_Date + "",
                            color: element.color,
                            textColor: element.textColor,
                            userId: $rootScope.decodedToken.userid,
                            userName: $rootScope.decodedToken.username,
                            groupid: element.className
                        }
                    }).then(function mySuccess(response) {
                      $rootScope.refreshedSite = 'kalender';
                      $state.go('sync');
                    });
                }
            });

        } else {
            calender_events[0].events.forEach(element => {
                if (element.id == current_event_id) {
                    element.title = $rootScope.eventName;
                    element.color = $("#bColor").val();
                    element.textColor = $("#fColor").val();

                    

                    s_Date = moment($rootScope.startDate).format('YYYY-MM-DD') + "T" + $rootScope.startTime + "+02:00";
                    e_Date = moment($rootScope.endDate).format('YYYY-MM-DD') + "T" + $rootScope.endTime + "+02:00";

                    element.start = s_Date;
                    element.end = e_Date;

                    element.className = $rootScope.groupSelect;

                    $http({
                        method: "PUT",
                        url: "calendar/editEvent",
                        data: {
                            id: current_event_id,
                            title: element.title,
                            start: s_Date + "",
                            end: e_Date + "",
                            color: element.color,
                            textColor: element.textColor,
                            userId: $rootScope.decodedToken.userid,
                            userName: $rootScope.decodedToken.username,
                            groupid: element.className
                        }
                    }).then(function mySuccess(response) {
                      $rootScope.refreshedSite = 'kalender';
                      $state.go('sync');
                    });
                }
            });
            $rootScope.setEventSource(calender_events[0].events);
        }

        //        console.log("EventSource => ", $rootScope);

                
            
    }

    $rootScope.deleteEventConfirm = function () {

        $http({
            method: "GET",
            url: "calendar/deleteEvent/" + current_event_id
        }).then(function mySuccess(response) {
            $rootScope.refreshedSite = 'kalender';
            $state.go('sync');
        });

    }

    


    this.isLogAdmin = function () {
        if (AuthService.isloggedIn()) {
            if ($rootScope.decodedToken.usertype == 1) {
                return true;
            }
        } else {
            return false;
        }
    }

});
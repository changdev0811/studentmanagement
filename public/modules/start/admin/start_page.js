angular.module('kita').controller('startCtrl', function (AuthService, $rootScope, $scope, $http, alertService, $window, $state) {

    var kitas = [];
    var actions = [{
        value: 9999999,
        text: "-"
    }];
    var kids = [];
    var kidsDaily = [];
    var d = moment();
    var weekday = new Array(7);
    var backgroundColor;
    var status;
    var kidsTemplate;

    $rootScope.hasKidsInGroup = true;

    $scope.hasClicked = true;

    $scope.kidsActive = 0;

    weekday[0] = "Sonntag";
    weekday[1] = "Montag";
    weekday[2] = "Dienstag";
    weekday[3] = "Mittwoch";
    weekday[4] = "Donnerstag";
    weekday[5] = "Freitag";
    weekday[6] = "Samstag";


    $scope.dayTypes = [
        {
            value: 1,
            text: "Normaler-Tag"
        },
        {
            value: 2,
            text: "Eingewöhnungs-Tag"
        },
        {
            value: 3,
            text: "Zusatz-Tag"
        }
    ]

    if (d.day() == 0) {
        d = moment(d).subtract(2, 'days');
    } else if (d.day() == 6) {
        d = moment(d).subtract(1, 'days');
    }

    var today = weekday[d.day()];

    $scope.weekDay = today;

    $rootScope.dateDayIso = moment(d).format('YYYY-MM-DD').toString();

    $rootScope.dateDay = moment(d).format('L').toString();

    $scope.hasDaily = true;

    if (AuthService.isloggedIn()) {
        $rootScope.isAuth = true;
    } else {
        $state.go('login');
    }



    angular.element(document).ready(function () {

        // Get User's kita id  /:groupid
        // Get groupname from db using kita id
        $rootScope.hasKidsInGroup = true;

        //console.log($rootScope.decodedToken.userid + "  " + $rootScope.decodedToken.username + "   " + $rootScope.decodedToken.kitaid);
        $("#fixTable").tableHeadFixer();
        $http({
            method: "GET",
            url: "kita/group/searchId/" + $rootScope.decodedToken.kitaid,
        }).then(function mySuccess(res) {
            res.data.forEach(element => {
                //element.groupname
                //    console.log("element value =>", element._id);
                kitas.push({ value: element._id, text: element.groupname });
            });
            $rootScope.groupNames = kitas;
        });

        $scope.selected = kitas[0];    // show default value here for options
        $scope.kitas = kitas;           // pass the data into scope

        $http({
            method: "POST",
            url: "action/getActions",
            data: { "kitaid": $rootScope.decodedToken.kitaid }
        }).then(function mySuccess(res) {
            res.data.forEach(element => {
                //element.groupname
                //    console.log("element value =>", element._id);
                actions.push({ value: element._id, text: element.name });
            });
            $rootScope.actionNames = actions;
        });

        $scope.actions = actions;           // pass the data into scope

    });

    $scope.hasChanged = function () {
        // console.log($scope.selected);
        // alert($scope.selected.text + "   " + $scope.selected.value);

        if ($scope.selected >= -1) {
            //Here we would like to show kid's info

            $http({
                method: "POST",
                url: "user/getUsersByGroupIdandDay/" + $scope.selected,
                data: {
                    "weekDay": $scope.weekDay
                }
            }).then(function mySuccess(res) {
                $rootScope.hasKidsInGroup = true;

                if (res.data.length > 0) {

                    $rootScope.hasKidsInGroup = false;
                    kids = [];
                    kidsDaily = [];
                    var i;
                    var kidsActive = 0;

                    $http({
                        method: "POST",
                        url: "daily/get",
                        data: {
                            "datum": $rootScope.dateDay,
                            "kitaid": $rootScope.decodedToken.kitaid,
                            "groupid": $scope.selected
                        }
                    }).then(function mySuccess(res) {
                        if (res.data != null && res.data != undefined) {
                            res.data.kids.forEach(element => {
                                if (element.Status == "1") {
                                    kidsActive = kidsActive + 1;
                                }
                                switch (element.Status) {
                                    case "1":
                                        backgroundColor = 'rgba(65, 207, 65, 0.623)';
                                        backgroundColorTxt = 'transparent';
                                        break;
                                    case "2":
                                        backgroundColor = 'white';
                                        backgroundColorTxt = 'transparent';
                                        break;
                                    case "3":
                                        backgroundColor = 'rgba(255, 77, 77, 0.61)';
                                        backgroundColorTxt = 'transparent';
                                        break;
                                    case "4":
                                        backgroundColor = 'rgba(197, 197, 197, 0.773)';
                                        backgroundColorTxt = 'transparent';
                                        break;
                                }

                                switch (true) {
                                    case element.kommen == null && element.gehen == null:
                                        kidsDaily.push({
                                            'uImage': element.uImage,
                                            'fullname': element.fullname,
                                            'username': element.username,
                                            'ActionNachm': element.ActionNachm,
                                            'ActionMorgen': element.ActionMorgen,
                                            'ActionSelMorgenSel': Number(element.ActionSelMorgenSel),
                                            'ActionSelNachmSel': Number(element.ActionSelNachmSel),
                                            'dayType': Number(element.dayType),
                                            'Schlafen': element.Schlafen,
                                            'Essen': element.Essen,
                                            'InfoAbend': element.InfoAbend,
                                            'InfoMorgen': element.InfoMorgen,
                                            'Status': element.Status,
                                            'kommen': new Date(undefined),
                                            'gehen': new Date(undefined),
                                            'contenteditable': false,
                                            'colorTextArea': { 'background-color': backgroundColorTxt },
                                            'colorRow': { 'background-color': backgroundColor },
                                            'placeholderInfoMorgen': "",
                                            'placeholderInfoAbend': "",
                                            'placeholderEssen': "",
                                            'placeholderActionNachm': "",
                                            'placeholderSchlafen': "",
                                            'placeholderActionMorgen': ""
                                        });
                                        break;
                                    case element.kommen != null && element.gehen == null:
                                        kidsDaily.push({
                                            'uImage': element.uImage,
                                            'fullname': element.fullname,
                                            'username': element.username,
                                            'ActionNachm': element.ActionNachm,
                                            'ActionMorgen': element.ActionMorgen,
                                            'ActionSelMorgenSel': Number(element.ActionSelMorgenSel),
                                            'ActionSelNachmSel': Number(element.ActionSelNachmSel),
                                            'dayType': Number(element.dayType),
                                            'Schlafen': element.Schlafen,
                                            'Essen': element.Essen,
                                            'InfoAbend': element.InfoAbend,
                                            'InfoMorgen': element.InfoMorgen,
                                            'Status': element.Status,
                                            'kommen': new Date(Number(element.kommen)),
                                            'gehen': new Date(undefined),
                                            'contenteditable': false,
                                            'colorTextArea': { 'background-color': backgroundColorTxt },
                                            'colorRow': { 'background-color': backgroundColor },
                                            'placeholderInfoMorgen': "",
                                            'placeholderInfoAbend': "",
                                            'placeholderEssen': "",
                                            'placeholderActionNachm': "",
                                            'placeholderSchlafen': "",
                                            'placeholderActionMorgen': ""
                                        });
                                        break;
                                    case element.kommen == null && element.gehen != null:
                                        kidsDaily.push({
                                            'uImage': element.uImage,
                                            'fullname': element.fullname,
                                            'username': element.username,
                                            'ActionNachm': element.ActionNachm,
                                            'ActionMorgen': element.ActionMorgen,
                                            'ActionSelMorgenSel': Number(element.ActionSelMorgenSel),
                                            'ActionSelNachmSel': Number(element.ActionSelNachmSel),
                                            'dayType': Number(element.dayType),
                                            'Schlafen': element.Schlafen,
                                            'Essen': element.Essen,
                                            'InfoAbend': element.InfoAbend,
                                            'InfoMorgen': element.InfoMorgen,
                                            'Status': element.Status,
                                            'kommen': new Date(undefined),
                                            'gehen': new Date(Number(element.gehen)),
                                            'contenteditable': false,
                                            'colorTextArea': { 'background-color': backgroundColorTxt },
                                            'colorRow': { 'background-color': backgroundColor },
                                            'placeholderInfoMorgen': "",
                                            'placeholderInfoAbend': "",
                                            'placeholderEssen': "",
                                            'placeholderActionNachm': "",
                                            'placeholderSchlafen': "",
                                            'placeholderActionMorgen': ""
                                        });
                                        break;
                                    case element.kommen != null && element.gehen != null:
                                        kidsDaily.push({
                                            'uImage': element.uImage,
                                            'fullname': element.fullname,
                                            'username': element.username,
                                            'ActionNachm': element.ActionNachm,
                                            'ActionMorgen': element.ActionMorgen,
                                            'ActionSelMorgenSel': Number(element.ActionSelMorgenSel),
                                            'ActionSelNachmSel': Number(element.ActionSelNachmSel),
                                            'dayType': Number(element.dayType),
                                            'Schlafen': element.Schlafen,
                                            'Essen': element.Essen,
                                            'InfoAbend': element.InfoAbend,
                                            'InfoMorgen': element.InfoMorgen,
                                            'Status': element.Status,
                                            'kommen': new Date(Number(element.kommen)),
                                            'gehen': new Date(Number(element.gehen)),
                                            'contenteditable': false,
                                            'colorTextArea': { 'background-color': backgroundColorTxt },
                                            'colorRow': { 'background-color': backgroundColor },
                                            'placeholderInfoMorgen': "",
                                            'placeholderInfoAbend': "",
                                            'placeholderEssen': "",
                                            'placeholderActionNachm': "",
                                            'placeholderSchlafen': "",
                                            'placeholderActionMorgen': ""
                                        });
                                        break;
                                }


                                kidsDaily.sort(function (a, b) {
                                    return a.Status - b.Status;
                                });

                            });
                            $scope.kidsDaily = kidsDaily;
                            $scope.kidsActive = kidsActive;
                            $scope.count_kidsDaily = kidsDaily.length;
                            $scope.hasDaily = true;
                        } else {
                            $scope.kidsDaily = null;
                            $scope.count_kidsDaily = 999;
                            $scope.hasDaily = false;
                        }
                    }, function myError(response) {
                        $scope.kidsDaily = [];
                        $scope.count_kidsDaily = 999;
                    });
                    $("#fixTable").tableHeadFixer();
                } else {
                    $rootScope.hasKidsInGroup = true;
                    $scope.hasDaily = false;
                }

            });
        } else {
            $scope.kids = [];
            $scope.count_kids = 999;
            $scope.kidsDaily = [];
            $scope.count_kidsDaily = 999;
        }
    }


    $scope.dateBefore = function () {

        var date = moment($rootScope.dateDayIso);

        date = moment(date).subtract(1, 'days');
        if (date.day() == 0) {
            date = moment(date).subtract(2, 'days');
        }
        $scope.weekDay = weekday[date.day()];
        $rootScope.dateDayIso = moment(date).format('YYYY-MM-DD').toString();
        $rootScope.dateDay = moment(date).format('L').toString();

        $scope.hasChanged();

    }

    $scope.dateNext = function () {
        var date = moment($rootScope.dateDayIso);

        date = moment(date).add(1, 'days');
        if (date.day() == 6) {
            date = moment(date).add(2, 'days');
        }
        $scope.weekDay = weekday[date.day()];
        $rootScope.dateDayIso = moment(date).format('YYYY-MM-DD').toString();
        $rootScope.dateDay = moment(date).format('L').toString();

        $scope.hasChanged();

    }

    $rootScope.changeStatus = function (fullname, uImage, username, status) {
        var time;
        var now = new Date();
        time = new Date(1970, 0, 1, now.getHours(), now.getMinutes(), 00).getTime();

        if ($rootScope.gehenKid == null || $rootScope.gehenKid == "Invalid Date" || $rootScope.gehenKid == NaN) {
            $rootScope.gehenKid = time;
        }

        $http({
            method: "PUT",
            url: "daily/setKidsStatus",
            data: {
                "username": username,
                "datum": $rootScope.dateDay,
                "Status": status,
                "kitaid": parseInt($rootScope.decodedToken.kitaid),
                "groupid": $scope.selected
            }
        }).then(function mySuccess(response) {

            if (status == 1 && $rootScope.oldStatus == 2) {
                $http({
                    method: "PUT",
                    url: "daily/setDailyKidsKommen",
                    data: {
                        "username": username,
                        "datum": $rootScope.dateDay,
                        "kommen": time,
                        "dayType": "1",
                        "kitaid": parseInt($rootScope.decodedToken.kitaid),
                        "groupid": $scope.selected
                    }
                }).then(function mySuccess(response) {
                    $scope.hasChanged();
                });
            } else if (status == 4 && ($rootScope.hasGehen == null || $rootScope.hasGehen == "Invalid Date")) {
                $http({
                    method: "PUT",
                    url: "daily/setDailyKidsGehen",
                    data: {
                        "username": username,
                        "datum": $rootScope.dateDay,
                        "gehen": $rootScope.gehenKid,
                        "kitaid": parseInt($rootScope.decodedToken.kitaid),
                        "groupid": $scope.selected
                    }
                }).then(function mySuccess(response) {
                    $scope.hasChanged();
                });
            } else {
                $scope.hasChanged();
            }

            if ($rootScope.kommenKid != null && $rootScope.kommenKid != "Invalid Date" && $rootScope.kommenKid != NaN) {

                var duration = moment.duration(moment($rootScope.gehenKid).diff(moment($rootScope.kommenKid.getTime())));
                var hours = extround(duration.asHours(), 10);

                $http({
                    method: "PUT",
                    url: "daily/setDailyKidsHours",
                    data: {
                        "username": username,
                        "datum": $rootScope.dateDay,
                        "hoursActive": hours,
                        "kitaid": parseInt($rootScope.decodedToken.kitaid),
                        "groupid": $scope.selected
                    }
                }).then(function mySuccess(response) {
                });
            }

            alertService.editKidDataSuccess();

        }, function myError(response) {
            alertService.editKidDataError();
        });

    }

    $rootScope.AddKids = function (username, uImage, fullname) {

        $http({
            method: "PUT",
            url: "daily/setKids",
            data: {
                "username": username,
                "uImage": uImage,
                "fullname": fullname,
                "datum": $rootScope.dateDay,
                "Status": status,
                "kitaid": parseInt($rootScope.decodedToken.kitaid),
                "groupid": $scope.selected
            }
        }).then(function mySuccess(response) {
            $scope.hasChanged();
            alertService.addkidSuccess(fullname);

        }, function myError(response) {
            alertService.addkidError(fullname);
        });
    }

    $rootScope.addActions = function (ActionSelMorgSel, ActionSelNachmSel) {

        kidsActions = [];
        kidsTemplate = [];

        if (ActionSelMorgSel == '?' && ActionSelNachmSel != '?') {

            $scope.kidsDaily.forEach(element => {
                var gehen;
                var kommen;

                if (element.kommen != null) {
                    kommen = element.kommen.getTime();
                }

                if (element.gehen != null) {
                    gehen = element.gehen.getTime();
                }
                if (element.Status == "1") {
                    kids.push({
                        'ActionSelMorgenSel': element.ActionSelMorgenSel,
                        'ActionSelNachmSel': ActionSelNachmSel.substr(7, ActionSelNachmSel.length - 7),
                        'dayType': element.dayType,
                        'uImage': element.uImage,
                        'fullname': element.fullname,
                        'username': element.username,
                        'ActionNachm': element.ActionNachm,
                        'ActionMorgen': element.ActionMorgen,
                        'Schlafen': element.Schlafen,
                        'kommen': kommen,
                        'gehen': gehen,
                        'Essen': element.Essen,
                        'InfoAbend': element.InfoAbend,
                        'InfoMorgen': element.InfoMorgen,
                        'Status': element.Status,
                        'placeholderInfoMorgen': "",
                        'placeholderInfoAbend': "",
                        'placeholderEssen': "",
                        'placeholderActionNachm': "",
                        'placeholderSchlafen': "",
                        'placeholderActionMorgen': ""
                    });

                } else {
                    kids.push({
                        'ActionSelMorgenSel': element.ActionSelMorgenSel,
                        'ActionSelNachmSel': element.ActionSelNachmSel,
                        'dayType': element.dayType,
                        'uImage': element.uImage,
                        'fullname': element.fullname,
                        'username': element.username,
                        'ActionNachm': element.ActionNachm,
                        'ActionMorgen': element.ActionMorgen,
                        'Schlafen': element.Schlafen,
                        'kommen': kommen,
                        'gehen': gehen,
                        'Essen': element.Essen,
                        'InfoAbend': element.InfoAbend,
                        'InfoMorgen': element.InfoMorgen,
                        'Status': element.Status,
                        'placeholderInfoMorgen': "",
                        'placeholderInfoAbend': "",
                        'placeholderEssen': "",
                        'placeholderActionNachm': "",
                        'placeholderSchlafen': "",
                        'placeholderActionMorgen': ""
                    });
                }
            });
            kidsTemplate = {
                "datum": $rootScope.dateDay,
                "kitaid": parseInt($rootScope.decodedToken.kitaid),
                "groupid": $scope.selected,
                "kids": kids
            };
            $http({
                method: "PUT",
                url: "daily/set",
                data: {
                    "datum": $rootScope.dateDay,
                    "kitaid": parseInt($rootScope.decodedToken.kitaid),
                    "groupid": $scope.selected,
                    "kidsTemplate": kidsTemplate
                }
            }).then(function mySuccess(response) {

                $scope.hasChanged();

            });

        } else if (ActionSelMorgSel != '?' && ActionSelNachmSel == '?') {

            $scope.kidsDaily.forEach(element => {
                var gehen;
                var kommen;

                if (element.kommen != null) {
                    kommen = element.kommen.getTime();
                }

                if (element.gehen != null) {
                    gehen = element.gehen.getTime();
                }

                if (element.Status == "1") {

                    kids.push({
                        'ActionSelMorgenSel': ActionSelMorgSel.substr(7, ActionSelMorgSel.length - 7),
                        'ActionSelNachmSel': element.ActionSelNachmSel,
                        'dayType': element.dayType,
                        'uImage': element.uImage,
                        'fullname': element.fullname,
                        'username': element.username,
                        'ActionNachm': element.ActionNachm,
                        'ActionMorgen': element.ActionMorgen,
                        'Schlafen': element.Schlafen,
                        'Essen': element.Essen,
                        'kommen': kommen,
                        'gehen': gehen,
                        'InfoAbend': element.InfoAbend,
                        'InfoMorgen': element.InfoMorgen,
                        'Status': element.Status,
                        'placeholderInfoMorgen': "",
                        'placeholderInfoAbend': "",
                        'placeholderEssen': "",
                        'placeholderActionNachm': "",
                        'placeholderSchlafen': "",
                        'placeholderActionMorgen': ""
                    });

                } else {
                    kids.push({
                        'ActionSelMorgenSel': element.ActionSelMorgenSel,
                        'ActionSelNachmSel': element.ActionSelNachmSel,
                        'dayType': element.dayType,
                        'uImage': element.uImage,
                        'fullname': element.fullname,
                        'username': element.username,
                        'ActionNachm': element.ActionNachm,
                        'ActionMorgen': element.ActionMorgen,
                        'Schlafen': element.Schlafen,
                        'kommen': kommen,
                        'gehen': gehen,
                        'Essen': element.Essen,
                        'InfoAbend': element.InfoAbend,
                        'InfoMorgen': element.InfoMorgen,
                        'Status': element.Status,
                        'placeholderInfoMorgen': "",
                        'placeholderInfoAbend': "",
                        'placeholderEssen': "",
                        'placeholderActionNachm': "",
                        'placeholderSchlafen': "",
                        'placeholderActionMorgen': ""
                    });
                }

            });
            kidsTemplate = {
                "datum": $rootScope.dateDay,
                "kitaid": parseInt($rootScope.decodedToken.kitaid),
                "groupid": $scope.selected,
                "kids": kids
            };

            $http({
                method: "PUT",
                url: "daily/set",
                data: {
                    "datum": $rootScope.dateDay,
                    "kitaid": parseInt($rootScope.decodedToken.kitaid),
                    "groupid": $scope.selected,
                    "kidsTemplate": kidsTemplate
                }
            }).then(function mySuccess(response) {

                $scope.hasChanged();

            });
        } else {

            $scope.kidsDaily.forEach(element => {
                var gehen;
                var kommen;

                if (element.kommen != null) {
                    kommen = element.kommen.getTime();
                }

                if (element.gehen != null) {
                    gehen = element.gehen.getTime();
                }
                if (element.Status == "1") {

                    kids.push({
                        'ActionSelMorgenSel': ActionSelMorgSel.substr(7, ActionSelMorgSel.length - 7),
                        'ActionSelNachmSel': ActionSelNachmSel.substr(7, ActionSelNachmSel.length - 7),
                        'dayType': element.dayType,
                        'uImage': element.uImage,
                        'fullname': element.fullname,
                        'username': element.username,
                        'ActionNachm': element.ActionNachm,
                        'ActionMorgen': element.ActionMorgen,
                        'Schlafen': element.Schlafen,
                        'Essen': element.Essen,
                        'kommen': kommen,
                        'gehen': gehen,
                        'InfoAbend': element.InfoAbend,
                        'InfoMorgen': element.InfoMorgen,
                        'Status': element.Status,
                        'placeholderInfoMorgen': "",
                        'placeholderInfoAbend': "",
                        'placeholderEssen': "",
                        'placeholderActionNachm': "",
                        'placeholderSchlafen': "",
                        'placeholderActionMorgen': ""
                    });

                } else {
                    kids.push({
                        'ActionSelMorgenSel': element.ActionSelMorgenSel,
                        'ActionSelNachmSel': element.ActionSelNachmSel,
                        'dayType': element.dayType,
                        'uImage': element.uImage,
                        'fullname': element.fullname,
                        'username': element.username,
                        'ActionNachm': element.ActionNachm,
                        'ActionMorgen': element.ActionMorgen,
                        'Schlafen': element.Schlafen,
                        'kommen': kommen,
                        'gehen': gehen,
                        'Essen': element.Essen,
                        'InfoAbend': element.InfoAbend,
                        'InfoMorgen': element.InfoMorgen,
                        'Status': element.Status,
                        'placeholderInfoMorgen': "",
                        'placeholderInfoAbend': "",
                        'placeholderEssen': "",
                        'placeholderActionNachm': "",
                        'placeholderSchlafen': "",
                        'placeholderActionMorgen': ""
                    });
                }
            });
            kidsTemplate = {
                "datum": $rootScope.dateDay,
                "kitaid": parseInt($rootScope.decodedToken.kitaid),
                "groupid": $scope.selected,
                "kids": kids
            };

            $http({
                method: "PUT",
                url: "daily/set",
                data: {
                    "datum": $rootScope.dateDay,
                    "kitaid": parseInt($rootScope.decodedToken.kitaid),
                    "groupid": $scope.selected,
                    "kidsTemplate": kidsTemplate
                }
            }).then(function mySuccess(response) {

                $scope.hasChanged();

            });
        }
    }

    $scope.createDaily = function () {
        $scope.hasClicked = false;
        $http({
            method: "POST",
            url: "user/getUsersByGroupIdandDay/" + $scope.selected,
            data: {
                "weekDay": $scope.weekDay
            }
        }).then(function mySuccess(res) {
            status = 2;

            res.data.forEach(element => {
                kids.push({
                    'uImage': element.profilPathImg,
                    'fullname': element.first_name + " " + element.last_name,
                    'username': element.username,
                    'dayType': "",
                    'ActionNachm': "",
                    'ActionMorgen': "",
                    'ActionSelMorgenSel': "",
                    'ActionSelNachmSel': "",
                    'Schlafen': "",
                    'Essen': "",
                    'kommen': null,
                    'gehen': null,
                    'InfoAbend': "",
                    'InfoMorgen': "",
                    'Status': status
                });
            });
            kidsTemplate = {
                "datum": $rootScope.dateDay,
                "kitaid": parseInt($rootScope.decodedToken.kitaid),
                "groupid": $scope.selected,
                "kids": kids
            };
            $http({
                method: "PUT",
                url: "daily/set",
                data: {
                    "datum": $rootScope.dateDay,
                    "kitaid": parseInt($rootScope.decodedToken.kitaid),
                    "groupid": $scope.selected,
                    "kidsTemplate": kidsTemplate
                }
            }).then(function mySuccess(response) {
                if (response.data != null && response.data != undefined) {
                    $http({
                        method: "POST",
                        url: "daily/get",
                        data: {
                            "datum": $rootScope.dateDay,
                            "kitaid": $rootScope.decodedToken.kitaid,
                            "groupid": $scope.selected
                        }
                    }).then(function mySuccess(res) {
                        if (res.data != null && res.data != undefined) {
                            res.data.kids.forEach(element => {
                                switch (element.Status) {
                                    case "1":
                                        backgroundColor = 'rgba(65, 207, 65, 0.623)';
                                        backgroundColorTxt = 'transparent';
                                        break;
                                    case "2":
                                        backgroundColor = 'white';
                                        backgroundColorTxt = 'transparent';
                                        break;
                                    case "3":
                                        backgroundColor = 'rgba(255, 77, 77, 0.61)';
                                        backgroundColorTxt = 'transparent';
                                        break;
                                    case "4":
                                        backgroundColor = 'rgba(197, 197, 197, 0.773)';
                                        backgroundColorTxt = 'transparent';
                                        break;
                                }
                                kidsDaily.push({
                                    'uImage': element.uImage,
                                    'fullname': element.fullname,
                                    'username': element.username,
                                    'ActionNachm': element.ActionNachm,
                                    'ActionMorgen': element.ActionMorgen,
                                    'ActionSelMorgenSel': element.ActionSelMorgenSel,
                                    'ActionSelNachmSel': element.ActionSelNachmSel,
                                    'dayType': element.dayType,
                                    'Schlafen': element.Schlafen,
                                    'Essen': element.Essen,
                                    'kommen': element.kommen,
                                    'gehen': element.gehen,
                                    'InfoAbend': element.InfoAbend,
                                    'InfoMorgen': element.InfoMorgen,
                                    'Status': element.Status,
                                    'contenteditable': false,
                                    'colorTextArea': { 'background-color': backgroundColorTxt },
                                    'colorRow': { 'background-color': backgroundColor },
                                    'placeholderInfoMorgen': "",
                                    'placeholderInfoAbend': "",
                                    'placeholderEssen': "",
                                    'placeholderActionNachm': "",
                                    'placeholderSchlafen': "",
                                    'placeholderActionMorgen': ""
                                });
                                kidsDaily.sort(function (a, b) {
                                    return a.Status - b.Status;
                                });
                            });
                            $scope.kidsDaily = kidsDaily;
                            $scope.count_kidsDaily = kidsDaily.length;
                            $scope.hasDaily = true;
                        } else {
                            $scope.kidsDaily = null;
                            $scope.count_kidsDaily = 999;
                            $scope.hasDaily = false;
                        }

                        $scope.hasClicked = true;
                    }, function myError(response) {
                        $scope.hasClicked = true;
                        $scope.kidsDaily = [];
                        $scope.count_kidsDaily = 999;
                    });
                }
            }, function myError(response) {

            });

        });

    }

    $scope.changeStatusOffline = function (fullname, uImage, username, oldStatus, groupId) {
        $rootScope.modalTitle = "Anwesenheitsliste";
        $rootScope.modalSuccesBtn = "Inaktiv setzen"
        $rootScope.modalLink = "dailyStatusOffline";
        $rootScope.modalBody1 = "Ist ";
        $rootScope.modalBody2 = " heute nicht in der Kita?";
        $rootScope.modalFullname = fullname;
        $rootScope.uImage = uImage;
        $rootScope.username = username;
        $rootScope.oldStatus = oldStatus;
        $rootScope.groupIdKid = groupId;
        $('#Modal').modal('show');
    }


    $scope.changeStatusOnline = function (fullname, uImage, username, oldStatus, groupId) {
        $rootScope.modalTitle = "Anwesenheitsliste";
        $rootScope.modalSuccesBtn = "Aktiv setzen"
        $rootScope.modalLink = "dailyStatusOnline";
        $rootScope.modalBody1 = "Ist ";
        $rootScope.modalBody2 = " heute in der Kita anwesend?";
        $rootScope.modalFullname = fullname;
        $rootScope.uImage = uImage;
        $rootScope.oldStatus = oldStatus;
        $rootScope.username = username;
        $rootScope.groupIdKid = groupId;
        $('#Modal').modal('show');
    }


    $scope.changeStatusDailyEnd = function (fullname, uImage, username, oldStatus, gehen, kommen, groupId) {
        $rootScope.modalTitle = "Anwesenheitsliste";
        $rootScope.modalSuccesBtn = "Entlassen"
        $rootScope.modalLink = "dailyStatusLeave";
        $rootScope.modalBody1 = "Wurde ";
        $rootScope.modalBody2 = " von den Erziehungsberechtigten abgeholt?";
        $rootScope.modalFullname = fullname;
        $rootScope.uImage = uImage;
        $rootScope.username = username;
        $rootScope.oldStatus = oldStatus;
        $rootScope.groupIdKid = groupId;
        $rootScope.hasGehen = gehen;

        $rootScope.gehenKid = gehen;
        $rootScope.kommenKid = kommen;

        $('#Modal').modal('show');
    }

    $scope.addKids = function (groupId) {
        var usernames = [];
        var i;
        $rootScope.modalBody = "Bitte wählen Sie ein Kind aus, welches Sie dem Tagesheft hinzufügen möchten.";
        $rootScope.modalTitle = $scope.weekDay + " " + $rootScope.dateDay + " - Kinder hinzufügen";
        $rootScope.modalSuccesBtn = "Hinzufügen"
        $rootScope.modalLink = "dailyStatusAddKids";
        $rootScope.modalLink2 = "dailyStatusAddKids";


        for (i = 0; i < $scope.kidsDaily.length; i++) {
            usernames.push($scope.kidsDaily[i].username);
        }

        $rootScope.kidsSelected = usernames;
        $rootScope.groupIdselected = groupId;
        $('#Modal').modal('show');
    }


    $scope.editKidData = function (kidDaily) {
        this.kidDaily.contenteditable = true;
        this.kidDaily.colorRow = { 'background-color': '#267ace;', 'color': 'white' };
        this.kidDaily.colorTextArea = { 'background-color': 'white', 'color': 'black' };

        this.kidDaily.placeholderInfoMorgen = "Info Morgen";
        this.kidDaily.placeholderInfoAbend = "Info Abend";
        this.kidDaily.placeholderEssen = "Essen";
        this.kidDaily.placeholderActionNachm = "Aktivität Nachmittag";
        this.kidDaily.placeholderSchlafen = "Schlafen";
        this.kidDaily.placeholderActionMorgen = "Aktivität Morgen";

    }

    $scope.reset = function (kidDaily) {
        this.kidDaily.contenteditable = false;
        this.kidDaily.colorRow = { 'background-color': 'rgba(65, 207, 65, 0.623)', 'color': 'black' };
        this.kidDaily.colorTextArea = { 'background-color': 'transparent', 'color': 'black' };
        this.kidDaily.placeholderInfoMorgen = "";
        this.kidDaily.placeholderInfoAbend = "";
        this.kidDaily.placeholderEssen = "";
        this.kidDaily.placeholderActionNachm = "";
        this.kidDaily.placeholderSchlafen = "";
        this.kidDaily.placeholderActionMorgen = "";
    }

    $scope.saveKidData = function (kidDaily) {

        var gehen;
        var kommen;

        if (this.kidDaily.kommen != null) {
            kommen = this.kidDaily.kommen.getTime();
        }

        if (this.kidDaily.gehen != null) {
            gehen = this.kidDaily.gehen.getTime();
        }

        this.kidDaily.placeholderInfoMorgen = "";
        this.kidDaily.placeholderInfoAbend = "";
        this.kidDaily.placeholderEssen = "";
        this.kidDaily.placeholderActionNachm = "";
        this.kidDaily.placeholderSchlafen = "";
        this.kidDaily.placeholderActionMorgen = "";

        $http({
            method: "PUT",
            url: "daily/setKidsData",
            data: {
                "username": this.kidDaily.username,
                "datum": $rootScope.dateDay,
                "kitaid": parseInt($rootScope.decodedToken.kitaid),
                "groupid": $scope.selected,
                "InfoMorgen": this.kidDaily.InfoMorgen,
                "InfoAbend": this.kidDaily.InfoAbend,
                "Essen": this.kidDaily.Essen,
                'kommen': kommen,
                'gehen': gehen,
                "Schlafen": this.kidDaily.Schlafen,
                "ActionMorgen": this.kidDaily.ActionMorgen,
                "ActionNachm": this.kidDaily.ActionNachm,
                "ActionSelMorgenSel": this.kidDaily.ActionSelMorgenSel,
                "ActionSelNachmSel": this.kidDaily.ActionSelNachmSel,
                'dayType': this.kidDaily.dayType,
            }
        }).then(function mySuccess(response) {
            alertService.editKidDataSuccess();
            $scope.hasChanged();
        }, function myError(response) {
            alertService.editKidDataError();
        });

        this.kidDaily.contenteditable = false;
        this.kidDaily.colorRow = { 'background-color': 'rgba(65, 207, 65, 0.623)', 'color': 'black' };

    }

    $scope.handleTextAreaHeight = function (e) {
        var element = e.target;

        element.style.overflow = 'hidden';
        element.style.height = 0;
        element.style.height = element.scrollHeight + 'px';
    };

    $scope.setActions = function () {
        $rootScope.modalBody = "Bitte wählen Sie die Aktivitäten aus, welches Sie bei allen Kindern hinzufügen möchten.";
        $rootScope.modalTitle = $scope.weekDay + " " + $rootScope.dateDay + " - Aktivitäten hinzufügen";
        $rootScope.modalSuccesBtn = "Hinzufügen"
        $rootScope.modalLink = "dailyStatusAddActions";

        $rootScope.kidsDaily = $scope.kidsDaily;

        $('#Modal').modal('show');
    }

    function extround(zahl, n_stelle) {
        zahl = (Math.round(zahl * n_stelle) / n_stelle);
        return zahl;
    }

});
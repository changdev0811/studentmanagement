angular.module('kita').controller('loadKitaDataCtrl', function (AuthService, $rootScope, $filter, $scope, $http, $state, alertService, $window) {

    var actions = [];
    var Users = [];

    $scope.kidSelectedADM = false;

    $scope.pwChange = 'false';

    if (AuthService.isloggedIn()) {
        $rootScope.isAuth = true;
    } else {
        $state.go('login');
    }

    $scope.dayTypes = [
        {
            value: 2,
            text: "Eingewöhnungs-Tag"
        },
        {
            value: 3,
            text: "Zusatz-Tag"
        }
    ]

    $rootScope.$on('$viewContentLoaded', function (event, viewConfig) {
        if ($rootScope.decodedToken.usertype != 1) {
            var kidsDaily3 = [];
            $http({
                method: "POST",
                url: "action/getActions",
                data: { "kitaid": $rootScope.decodedToken.kitaid }
            }).then(function mySuccess(res) {
                res.data.forEach(element => {
                    //element.groupname
                    //    console.log("element value =>", element._id);
                    actions.push({ value: element._id, text: element.name, actionImage: element.uImage });
                });
                $rootScope.actionNames = actions;
                $scope.actions = actions;           // pass the data into scope

                $http({
                    method: "PUT",
                    url: "daily/getDailyByKids",
                    data: {
                        "username": $rootScope.decodedToken.username,
                        "kitaid": $rootScope.decodedToken.kitaid,
                        "groupid": $rootScope.decodedToken.groupid
                    }
                }).then(function mySuccess(res) {
                    res.data.forEach(element => {

                        element.kids.forEach(kidDaily => {
                            if (kidDaily.username == $rootScope.decodedToken.username) {

                                var actionImageMorg = "";
                                var actionImageNachm = "";

                                actions.some(action => {

                                    if (Number(action.value) == Number(kidDaily.ActionSelMorgenSel) && Number(action.value) == Number(kidDaily.ActionSelNachmSel)) {
                                        actionImageMorg = action.actionImage;
                                        actionImageNachm = action.actionImage;
                                        return true;
                                    } else if (Number(action.value) == Number(kidDaily.ActionSelMorgenSel) && Number(action.value) != Number(kidDaily.ActionSelNachmSel)) {
                                        actionImageMorg = action.actionImage;
                                        return true;
                                    } else if (Number(action.value) != Number(kidDaily.ActionSelMorgenSel) && Number(action.value) == Number(kidDaily.ActionSelNachmSel)) {
                                        actionImageNachm = action.actionImage;
                                        return true;
                                    }

                                });

                                kidsDaily3.push({
                                    'uImage': kidDaily.uImage,
                                    'date': element.datum,
                                    'ActionNachm': kidDaily.ActionNachm,
                                    'ActionMorgen': kidDaily.ActionMorgen,
                                    'Schlafen': kidDaily.Schlafen,
                                    'Essen': kidDaily.Essen,
                                    'InfoAbend': kidDaily.InfoAbend,
                                    'InfoMorgen': kidDaily.InfoMorgen,
                                    'ActionSelMorgenSel': Number(kidDaily.ActionSelMorgenSel),
                                    'ActionSelNachmSel': Number(kidDaily.ActionSelNachmSel),
                                    'actionImageMorg': actionImageMorg,
                                    'actionImageNachm': actionImageNachm,
                                    'Status': kidDaily.Status,
                                    'contenteditable': false,
                                    'colorRow': { 'background-color': 'white' }
                                });
                            }
                        });
                        function comp(a, b) {

                            return moment(b.date, "DD.MM.YYYY").unix() - moment(a.date, "DD.MM.YYYY").unix();

                        }

                        kidsDaily3.sort(comp);
                    });
                    $scope.kidsDaily3 = kidsDaily3;
                    $scope.count_kidsDaily3 = kidsDaily3.length;

                    $("#fixTable").tableHeadFixer();
                }, function myError(response) {
                    $scope.kidsDaily3 = [];
                    $scope.count_kidsDaily3 = 999;
                });

            });
        } else {

            $http({
                method: "POST",
                url: "action/getActions",
                data: { "kitaid": $rootScope.decodedToken.kitaid }
            }).then(function mySuccess(res) {
                res.data.forEach(element => {
                    //element.groupname
                    //    console.log("element value =>", element._id);
                    actions.push({ value: element._id, text: element.name, actionImage: element.uImage });
                });
                $rootScope.actionNames = actions;
                $scope.actions = actions;           // pass the data into scope
            });
        }

        $scope.checkBox = {
            montag: false,
            dienstag: false,
            mittwoch: false,
            donnerstag: false,
            freitag: false
        };

        $scope.username = null;
        $scope.first_name = null;
        $scope.last_name = null;
        $scope.street = null;
        $scope.house_nr = null;
        $scope.plz = null;
        $scope.ort = null;
        $scope.birth_date = null;
        $scope.telefon = null;
        $scope.email = null;
        $scope.groupid = null;
        $scope.description = null;
        $scope.vorlieben = null;
        $scope.essenAllerg = null;


        var kitaObj;

        $http({
            method: "GET",
            url: "kita/searchId/" + $rootScope.decodedToken.kitaid
        }).then(function mySuccess(response) {
            if (response.data == null) {
                console.log(response.statusText);
            } else {

                kitaObj = response.data.message;

                $scope.kitaid = kitaObj._id;

                $scope.kitaname = kitaObj.kitaname;

                $scope.kitaDescription = kitaObj.description;

                $scope.kitaTelefon = kitaObj.telefon;

                $scope.kitaEmail = kitaObj.email;

                $scope.kitaOrt = kitaObj.ort;

                $scope.kitaKanton = kitaObj.kanton;

                $scope.kitaPlz = kitaObj.plz;

                $scope.kitaAddress = kitaObj.address;

                $scope.uImageKita = kitaObj.uImageKita;

            }

        }, function myError(error) {
            console.log(error.statusText);
        });

        var i;
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


    $scope.usernameChecker = function () {
        $http({
            method: "POST",
            url: "user/checkUsername",
            data: {
                'username': $scope.username
            }
        }).then(function mySuccess(response) {
            console.log();
            if (response.data == null) {
                $rootScope.isUsername = false;
            } else {
                $rootScope.isUsername = true;
            }
        }, function myError(response) {
            console.log(response.statusText);
        });
    }

    function generatePassword() {
        var length = 8,
            charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
            retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return retVal;
    }

    $scope.register = function () {

        $rootScope.password = generatePassword();
        $rootScope.username = $scope.username;
        $rootScope.kitaname = $scope.kitaname;

        var address = null;
        if ($scope.street != null && $scope.house_nr != null) {
            address = $scope.street + "_" + $scope.house_nr;
        }
        var usertype = 0;
        var groupid = $scope.groupSelected._id;

        $http({
            method: "POST",
            url: "/user/register",
            data: {
                "username": $scope.username,
                "first_name": $scope.first_name,
                "last_name": $scope.last_name,
                "address": address,
                "birth_date": $scope.birth_date,
                "telefon": $scope.telefon,
                "email": $scope.email,
                "usertype": usertype,
                "kitaid": $scope.kitaid,
                "groupid": groupid,
                "description": $scope.description,
                "vorlieben": $scope.vorlieben,
                "essenAllerg": $scope.essenAllerg,
                "password": $rootScope.password,
                "Montag": $scope.checkBox.montag,
                "Dienstag": $scope.checkBox.dienstag,
                "Mittwoch": $scope.checkBox.mittwoch,
                "Donnerstag": $scope.checkBox.donnerstag,
                "Freitag": $scope.checkBox.freitag,
            }
        }).then(function mySuccess(response) {
           
            alertService.showNotificationSuccesRegister($scope.username);

            $rootScope.modalTitle = "PDF-Drucken";
            $rootScope.modalSuccesBtn = "Bestätigen";
            $rootScope.modalLink = "createUserPDF";
            $rootScope.modalBody = "Möchten Sie für " + $rootScope.username + " die Benutzerdaten als PDF ausdrucken/herunterladen?"
            $('#Modal').modal('show');
        }, function myError(response) {
            alertService.showNotificationErrorRegister();
            console.log(response);
        });
    }

    $scope.editUser = function () {
        $rootScope.username = $scope.username;
        $rootScope.first_name = $scope.first_name;
        $rootScope.last_name = $scope.last_name;
        if ($scope.street != null && $scope.house_nr != null) {
            $rootScope.address = $scope.street + "_" + $scope.house_nr;
        }
        $rootScope.plz = $scope.plz;
        $rootScope.ort = $scope.ort;
        $rootScope.birth_date = $scope.birth_date;
        $rootScope.telefon = $scope.telefon;
        $rootScope.email = $scope.email;
        $rootScope.groupid = $scope.groupSelected._id;
        $rootScope.description = $scope.description;
        $rootScope.vorlieben = $scope.vorlieben;
        $rootScope.essenAllerg = $scope.essenAllerg;
        $rootScope.montag = $scope.checkBox.montag;
        $rootScope.dienstag = $scope.checkBox.dienstag,
        $rootScope.mittwoch = $scope.checkBox.mittwoch;
        $rootScope.donnerstag = $scope.checkBox.donnerstag;
        $rootScope.freitag = $scope.checkBox.freitag;

        $rootScope.modalTitle = "Benutzerdaten anpassen";
        $rootScope.modalSuccesBtn = "Änderungen bestätigen";
        $rootScope.modalLink = "editUser";
        $rootScope.modalBody = "Sind Sie sicher, dass Sie die Benutzerdaten von " + $scope.username + " ändern wollen?"
        $('#Modal').modal('show');

    }

    $scope.resetPW = function () {

        $rootScope.newPwADM = generatePassword();
        $rootScope.username = $scope.userSelected.username;
        $rootScope.modalTitle = "Passwort zurücksetzen";
        $rootScope.modalSuccesBtn = "Bestätigen"
        $rootScope.modalLink = "pwChange";
        $rootScope.modalBody = "Sind Sie sicher, dass Sie das Passwort von " + $scope.username + " zurücksetzen wollen?"
        $('#Modal').modal('show');
    }



    $scope.deleteUser = function () {

        $rootScope.username = $scope.username;
        $rootScope.userid = $scope.userid;

        $rootScope.modalTitle = "Benutzer löschen";
        $rootScope.modalSuccesBtn = "Löschen bestätigen"
        $rootScope.modalLink = "deleteUser";
        $rootScope.modalBody = "Sind Sie sicher, dass Sie den User " + $scope.username + " löschen wollen?"
        $('#Modal').modal('show');

    }



    $scope.loadUsers = function (groupid) {
        $scope.Users = [];
        $http({
            method: "GET",
            url: "user/getUsersByGroup/" + groupid
        }).then(function mySuccess(response) {

            Users = [];
            response.data.forEach(element => {
                Users.push({
                    '_id': element._id,
                    'name': element.first_name + " " + element.last_name,
                    'username': element.username
                });

            $scope.kidSelectedADM = false;

            });

            function compare(a, b) {
                // Use toUpperCase() to ignore character casing
                const usernameA = a.name.toUpperCase();
                const usernameB = b.name.toUpperCase();

                let comparison = 0;
                if (usernameA > usernameB) {
                    comparison = 1;
                } else if (usernameA < usernameB) {
                    comparison = -1;
                }
                return comparison;
            }

            Users.sort(compare);


            $scope.Users = Users;
        }, function myError(error) {
            console.log(error.statusText);
        });
    }

    $scope.setUsername = function () {
        if ($scope.first_name != "" && $scope.first_name != undefined && $scope.first_name != null && $scope.last_name != "" && $scope.last_name != undefined && $scope.last_name != null) {
            $scope.username = $scope.first_name.replace(/\s/g,'') + "." + $scope.last_name.replace(/\s/g,'');
        }
    }

    $scope.loadUserData = function (userid) {
        var userObj;
        var street;
        var house_nr;

        $http({
            method: "GET",
            url: "user/getUserDataById/" + userid
        }).then(function mySuccess(response) {
            if (response.data == null) {
                console.log(response.statusText);
            } else {
                userObj = response.data;
                if (userObj.address != null) {
                    var array = userObj.address.split("_");
                    street = array[0];
                    house_nr = array[1];
                }

                $scope.userid = userid;

                $scope.username = userObj.username;

                $scope.first_name = userObj.first_name;

                $scope.last_name = userObj.last_name;

                $scope.street = street;

                $scope.house_nr = house_nr;

                $scope.birth_date = new Date(userObj.birth_date);

                $scope.plz = userObj.plz;

                $scope.ort = userObj.ort;

                $scope.email = userObj.email;

                $scope.telefon = userObj.telefon;

                $scope.description = userObj.description;

                $scope.vorlieben = userObj.vorlieben;

                $scope.essenAllerg = userObj.essenAllerg;

                $scope.checkBox.montag = userObj.Montag;

                $scope.checkBox.dienstag = userObj.Dienstag;

                $scope.checkBox.mittwoch = userObj.Mittwoch;

                $scope.checkBox.donnerstag = userObj.Donnerstag;

                $scope.checkBox.freitag = userObj.Freitag;

                $scope.groupSelected._id = userObj.groupid;

                $scope.checked = {
                    montag: $scope.checkBox.montag,
                    dienstag: $scope.checkBox.dienstag,
                    mittwoch: $scope.checkBox.mittwoch,
                    donnerstag: $scope.checkBox.donnerstag,
                    freitag: $scope.checkBox.freitag
                }

                $scope.pwChange = userObj.pwChange;

                $scope.password = userObj.newPwReset;

                $scope.kidSelectedADM = true;
            }

        }, function myError(error) {
            console.log(error.statusText);
        });
    }

    $scope.hasChangedArchive = function () {

        $scope.selectedDateIso = moment($scope.selectedMonth).format('DD.MM.YYYY').toString();

        $scope.selectedMonthISO = moment($scope.selectedMonth).format('MMMM YYYY').toString();


        var kidsDaily3 = [];
        var days = [];
        var backgroundColor;
        var textColor;

        $http({
            method: "POST",
            url: "daily/getDailysByKidCustome",
            data: {
                "kitaid": $rootScope.decodedToken.kitaid,
                "groupid": $rootScope.decodedToken.groupid,
                "monthDate": $scope.selectedDateIso
            }
        }).then(function mySuccess(res) {

            res.data.forEach(element => {
                element.kids.some(kidDaily => {
                    if (kidDaily.username == $rootScope.decodedToken.username && (kidDaily.Status == "4" || kidDaily.Status == "3")) {

                        var actionImageMorg = "";
                        var actionImageNachm = "";

                        actions.some(action => {

                            if (Number(action.value) == Number(kidDaily.ActionSelMorgenSel) && Number(action.value) == Number(kidDaily.ActionSelNachmSel)) {
                                actionImageMorg = action.actionImage;
                                actionImageNachm = action.actionImage;
                                return true;
                            } else if (Number(action.value) == Number(kidDaily.ActionSelMorgenSel) && Number(action.value) != Number(kidDaily.ActionSelNachmSel)) {
                                actionImageMorg = action.actionImage;
                                return true;
                            } else if (Number(action.value) != Number(kidDaily.ActionSelMorgenSel) && Number(action.value) == Number(kidDaily.ActionSelNachmSel)) {
                                actionImageNachm = action.actionImage;
                                return true;
                            }

                        });

                        kidsDaily3.push({
                            'uImage': kidDaily.uImage,
                            'date': element.datum,
                            'ActionNachm': kidDaily.ActionNachm,
                            'ActionMorgen': kidDaily.ActionMorgen,
                            'Schlafen': kidDaily.Schlafen,
                            'Essen': kidDaily.Essen,
                            'InfoAbend': kidDaily.InfoAbend,
                            'InfoMorgen': kidDaily.InfoMorgen,
                            'ActionSelMorgenSel': Number(kidDaily.ActionSelMorgenSel),
                            'ActionSelNachmSel': Number(kidDaily.ActionSelNachmSel),
                            'actionImageMorg': actionImageMorg,
                            'actionImageNachm': actionImageNachm,
                            'Status': kidDaily.Status,
                            'contenteditable': false,
                            'colorRow': { 'background-color': 'white' }
                        });

                        return true;
                    }
                });

                if (kidsDaily3.length > 0) {
                    function comp(a, b) {

                        return moment(b.date, "DD.MM.YYYY").unix() - moment(a.date, "DD.MM.YYYY").unix();

                    }

                    kidsDaily3.sort(comp);
                    $scope.hasDaily = true;

                }

            });
            if (kidsDaily3.length <= 0) {
                $scope.hasDaily = false;
            }
            $scope.kidsDaily4 = kidsDaily3;
            $scope.count_kidsDaily3 = kidsDaily3.length;

            $("#fixTable").tableHeadFixer();
        }, function myError(response) {
            $scope.kidsDaily4 = [];
            $scope.kidsDaily4 = 999;
        });

    }

    $scope.hasChangedArchiveADM = function () {

        if ($scope.selectedMonth != null && $scope.selectedMonth != undefined && $scope.selectedMonth != "") {

            $scope.selectedDateIso = moment($scope.selectedMonth).format('DD.MM.YYYY').toString();

            $scope.selectedMonthISO = moment($scope.selectedMonth).format('MMMM YYYY').toString();


            var kidsDaily3 = [];
            var days = [];
            var backgroundColor;
            var textColor;

            $http({
                method: "POST",
                url: "daily/getDailysByKidCustome",
                data: {
                    "kitaid": $rootScope.decodedToken.kitaid,
                    "groupid": $scope.groupSelected,
                    "monthDate": $scope.selectedDateIso
                }
            }).then(function mySuccess(res) {

                res.data.forEach(element => {
                    element.kids.some(kidDaily => {
                        if (kidDaily.username == $scope.userSelected.username && (kidDaily.Status == "4" || kidDaily.Status == "3")) {

                            var actionImageMorg = "";
                            var actionImageNachm = "";

                            actions.some(action => {

                                if (Number(action.value) == Number(kidDaily.ActionSelMorgenSel) && Number(action.value) == Number(kidDaily.ActionSelNachmSel)) {
                                    actionImageMorg = action.actionImage;
                                    actionImageNachm = action.actionImage;
                                    return true;
                                } else if (Number(action.value) == Number(kidDaily.ActionSelMorgenSel) && Number(action.value) != Number(kidDaily.ActionSelNachmSel)) {
                                    actionImageMorg = action.actionImage;
                                    actionImageNachm = "";
                                    return true;
                                } else if (Number(action.value) != Number(kidDaily.ActionSelMorgenSel) && Number(action.value) == Number(kidDaily.ActionSelNachmSel)) {
                                    actionImageMorg = "";
                                    actionImageNachm = action.actionImage;
                                    return true;
                                } else {
                                    actionImageMorg = "";
                                    actionImageNachm = "";
                                }


                            });

                            kidsDaily3.push({
                                'uImage': kidDaily.uImage,
                                'date': element.datum,
                                'ActionNachm': kidDaily.ActionNachm,
                                'ActionMorgen': kidDaily.ActionMorgen,
                                'Schlafen': kidDaily.Schlafen,
                                'Essen': kidDaily.Essen,
                                'InfoAbend': kidDaily.InfoAbend,
                                'InfoMorgen': kidDaily.InfoMorgen,
                                'ActionSelMorgenSel': Number(kidDaily.ActionSelMorgenSel),
                                'ActionSelNachmSel': Number(kidDaily.ActionSelNachmSel),
                                'actionImageMorg': actionImageMorg,
                                'actionImageNachm': actionImageNachm,
                                'Status': kidDaily.Status,
                                'contenteditable': false,
                                'colorRow': { 'background-color': 'white' }
                            });

                            return true;
                        }
                    });

                    if (kidsDaily3.length > 0) {
                        function comp(a, b) {

                            return moment(b.date, "DD.MM.YYYY").unix() - moment(a.date, "DD.MM.YYYY").unix();

                        }

                        kidsDaily3.sort(comp);
                        $scope.hasDaily = true;

                    }

                });
                if (kidsDaily3.length <= 0) {
                    $scope.hasDaily = false;
                }
                $scope.kidsDaily5 = kidsDaily3;
                $scope.count_kidsDaily3 = kidsDaily3.length;

                $("#fixTable").tableHeadFixer();
            }, function myError(response) {
                $scope.kidsDaily5 = [];
                $scope.kidsDaily5 = 999;
            });

        }
    }


    $scope.getStunden = function () {

        $scope.countHours = 0;

        $scope.selectedDateIso = moment($scope.selectedMonth).format('DD.MM.YYYY').toString();

        var days = [];
        var backgroundColor;
        var textColor;

        $http({
            method: "POST",
            url: "daily/getDailysByKidCustome",
            data: {
                "kitaid": $rootScope.decodedToken.kitaid,
                "groupid": $scope.groupSelected,
                "monthDate": $scope.selectedDateIso
            }
        }).then(function mySuccess(res) {
            res.data.forEach(element => {
                element.kids.forEach(kidDaily => {
                    if (kidDaily.username == $scope.userSelected.username && kidDaily.Status == "4") {

                        $scope.countHours = $scope.countHours + kidDaily.hoursActive;

                        $scope.countHours = Math.round($scope.countHours * 10) / 10;


                        if (kidDaily.dayType == "1") {
                            backgroundColor = 'rgba(29, 170, 29, 0.755)';
                            textColor = 'white';
                        } else if (kidDaily.dayType == "2") {
                            backgroundColor = '#267ace;';
                            textColor = 'white';
                        } else {
                            backgroundColor = '#eb5600bd;';
                            textColor = 'white';
                        }

                        kommenH = new Date(Number(kidDaily.kommen)).getHours();
                        kommenH = ("0" + kommenH).slice(-2);

                        kommenM = new Date(Number(kidDaily.kommen)).getMinutes();
                        kommenM = ("0" + kommenM).slice(-2);

                        gehenH = new Date(Number(kidDaily.gehen)).getHours();
                        gehenH = ("0" + gehenH).slice(-2);

                        gehenM = new Date(Number(kidDaily.gehen)).getMinutes();
                        gehenM = ("0" + gehenM).slice(-2);

                        days.push({
                            'date': element.datum,
                            'kommen': kommenH + ":" + kommenM,
                            'gehen': gehenH + ":" + gehenM,
                            'hoursActive': kidDaily.hoursActive,
                            'colorRow': { 'background-color': backgroundColor, 'color': textColor }
                        });

                    }

                });
            });

            function comp(a, b) {

                return moment(a.date, "DD.MM.YYYY").unix() - moment(b.date, "DD.MM.YYYY").unix();

            }

            days.sort(comp);

            $scope.daysKid = days;

        }, function myError(response) {

        });
    }

    $scope.getStundenExt = function () {

        $scope.selectedDateIso = moment($scope.selectedMonth).format('DD.MM.YYYY').toString();

        var days = [];
        var backgroundColor;
        var textColor;

        $http({
            method: "POST",
            url: "daily/getDailysByKidCustome",
            data: {
                "kitaid": $rootScope.decodedToken.kitaid,
                "groupid": $scope.groupSelected,
                "monthDate": $scope.selectedDateIso
            }
        }).then(function mySuccess(res) {
            res.data.forEach(element => {
                element.kids.forEach(kidDaily => {
                    if (kidDaily.Status == "4") {
                        if (Number(kidDaily.dayType) == $scope.dayTypeSelected) {
                            if (kidDaily.dayType == "1") {
                                backgroundColor = 'rgba(29, 170, 29, 0.755)';
                                textColor = 'white';
                            } else if (kidDaily.dayType == "2") {
                                backgroundColor = '#267ace;';
                                textColor = 'white';
                            } else {
                                backgroundColor = '#eb5600bd;';
                                textColor = 'white';
                            }

                            kommenH = new Date(Number(kidDaily.kommen)).getHours();
                            kommenH = ("0" + kommenH).slice(-2);

                            kommenM = new Date(Number(kidDaily.kommen)).getMinutes();
                            kommenM = ("0" + kommenM).slice(-2);

                            gehenH = new Date(Number(kidDaily.gehen)).getHours();
                            gehenH = ("0" + gehenH).slice(-2);

                            gehenM = new Date(Number(kidDaily.gehen)).getMinutes();
                            gehenM = ("0" + gehenM).slice(-2);

                            days.push({
                                'name': kidDaily.fullname,
                                'date': element.datum,
                                'kommen': kommenH + ":" + kommenM,
                                'gehen': gehenH + ":" + gehenM,
                                'hoursActive': kidDaily.hoursActive,
                                'colorRow': { 'background-color': backgroundColor, 'color': textColor }
                            });

                        }

                    }

                });
            });

            function comp(a, b) {

                return moment(a.date, "DD.MM.YYYY").unix() - moment(b.date, "DD.MM.YYYY").unix();

            }

            days.sort(comp);

            $scope.daysKid2 = days;

        }, function myError(response) {

        });
    }

    $scope.showActionImage = function (ActionId, ActionImage) {
        var ActionName;
        $scope.actions.some(action => {
            if (Number(action.value) == Number(ActionId)) {
                ActionName = action.text;
                return true;
            }
        });

        $rootScope.modalTitle = ActionName;
        $rootScope.ActionImageKid = ActionImage;
        $rootScope.modalSuccesBtn = "Ok"
        $rootScope.modalLink = "ActionImage";
        $rootScope.modalLink2 = "ActionImage";

        $('#Modal').modal('show');
    }


    $rootScope.createUserPDF = function(password, username, kitaname){

        // Usage
        getDataUri('assets/img/Logo.PNG', function (dataUri) {

            // Do whatever you'd like with the Data URI!
            var docDefinition = {
                content: [
                    {
                        image: 'data:image/jpeg;base64,' + dataUri,
                        width: 150,
                        alignment: 'center'
                    },
                    {
                        text: 'SimpleVisor-WebApp Login',
                        style: 'header',
                        alignment: 'center'
                    },
                    // using a { text: '...' } object lets you set styling properties
                    {
                        text: 'Die ' + kitaname + " hat sich für die Einführung des digitalen Alltags in Kindertagesstätten mit SimpleVisor entschieden. " +
                            'Mit der Kita-App SimpleVisor haben aber nicht nur die Kitas etwas davon: \n\nJedes Kind erhält seinen persönlichen Login, mit dem ' +
                            'sich jeder Elternteil anmelden kann, um die alltäglichen Informationen des Kitaaufenthaltes elektronisch anzusehen.'
                        , fontSize: 15,
                        alignment: 'justify'
                    },
                    {
                        style: 'tableExample',
                        table: {
                            widths: [250, '*'],
                            body: [
                                [
                                    {
                                        text: 'Username',
                                        fillColor: '#66c2ff',

                                    },
                                    {
                                        text: 'Passwort',
                                        fillColor: '#66c2ff',

                                    }
                                ],
                                [
                                    {
                                        text: username,
                                        fillColor: '#98d1ff',

                                    },
                                    {
                                        text: password,
                                        fillColor: '#98d1ff',

                                    }
                                ]
                            ]
                        },
                        alignment: 'center'
                    },
                    {
                        text: 'Um auf SimpleVisor zuzugreifen, begeben Sie sich mit einem Laptop, Tablet oder Handy auf folgende Adresse:\n\n',
                        fontSize: 15,
                        alignment: 'justify'
                    }, {
                        ul: [
                            'https://www.app-simplevisor.ch'
                        ]
                    },
                    {
                        text: '\n\nHier können Sie sich mit den oben angegebenen Login-Daten anmelden. SimpleVisor ist von Überall und jedem Gerät zugänglich, sofern eine laufende Internetverbindung besteht.' +
                            '\n\nMöchten Sie noch mehr über SimpleVisor erfahren oder haben Fragen zur App, besuchen Sie folgende Adresse:\n\n',
                        fontSize: 15,
                        alignment: 'justify'
                    },
                    {
                        ul: [
                            'https://www.simplevisor.ch'
                        ]
                    },
                    {
                        text: '\n\nWir bedanken uns für Ihre Zeit und wünschen Ihnen viel Spass bei der benutzung der App.',
                        fontSize: 15,
                        alignment: 'justify'
                    },
                    {
                        text: $scope.kitaname + " - " + new Date().getFullYear(),
                        style: ['quote', 'small'],
                        alignment: 'right'
                    }
                ],
                styles: {
                    header: {
                        fontSize: 18,
                        bold: true,
                        margin: [0, 10, 0, 30]
                    },
                    tableExample: {
                        fontSize: 15,
                        margin: [10, 10, 10, 10]
                    },
                    quote: {
                        italics: true
                    },
                    small: {
                        fontSize: 8,
                        margin: [0, 65, 0, 0]
                    }
                },
                defaultStyle: {
                    fontSize: 15
                }
            };
            pdfMake.createPdf(docDefinition).open();
        });
    }


    function getDataUri(url, callback) {
        var image = new Image();

        image.onload = function () {
            var canvas = document.createElement('canvas');
            canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
            canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size

            canvas.getContext('2d').drawImage(this, 0, 0);

            // Get raw image data
            callback(canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, ''));

            // ... or get as Data URI
            callback(canvas.toDataURL('image/png'));
        };

        image.src = url;
    }

});
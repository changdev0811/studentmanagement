angular.module('kita').controller('kitaCtrl', function (AuthService, $rootScope, $scope, $http, alertService, $window, $state, uploadFileService) {

    var kitas = [];
    var actions = [];
    var actionsArchive = [];
    var kids = [];
    var croppedImage = "";

    $scope.cropped = {
        source: 'assets/img/default.png'
    };


    var kidsDaily = [];

    var d = new Date();
    var weekday = new Array(7);

    weekday[0] = "Sonntag";
    weekday[1] = "Montag";
    weekday[2] = "Dienstag";
    weekday[3] = "Mittwoch";
    weekday[4] = "Donnerstag";
    weekday[5] = "Freitag";
    weekday[6] = "Samstag";

    var selectedDay;

    var d = moment();

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

    $scope.$watch('cropped.image', function (nVal) {
        if (nVal) {
            $rootScope.croppedImageAction = nVal;
        }
    });

    $scope.$watch('cropped.image', function (nVal) {
        if (nVal) {
            $rootScope.croppedImageKita = nVal;
        }
    });

    angular.element(document).ready(function () {
        // Get User's kita id  /:groupid
        // Get groupname from db using kita id

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

                console.log(res.data);

                $http({
                    method: "POST",
                    url: "daily/getDailysByKidCustome",
                    data: {
                        "kitaid": $rootScope.decodedToken.kitaid,
                        "groupid": $rootScope.decodedToken.groupid,
                        "monthDate": $rootScope.dateDay
                    }
                }).then(function mySuccess(res) {
                    res.data.some(element => {

                        element.kids.some(kidDaily => {
                            if (kidDaily.username == $rootScope.decodedToken.username && element.datum == $rootScope.dateDay) {

                                var actionImageMorg = "";
                                var actionImageNachm = "";

                               console.log(kidDaily.ActionSelNachmSel);

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

                            return true;
                        }

                    });
                    if (kidsDaily3.length <= 0) {
                        $scope.hasDaily = false;
                    }
                    $scope.kidsDaily3 = kidsDaily3;
                    $scope.count_kidsDaily3 = kidsDaily3.length;

                    $("#fixTable").tableHeadFixer();
                }, function myError(response) {
                    $scope.kidsDaily3 = [];
                    $scope.count_kidsDaily3 = 999;
                });

            });



        } else {

            $("#fixTable").tableHeadFixer();
            $("#fixTable2").tableHeadFixer();

            $http({
                method: "GET",
                url: "kita/group/searchId/" + $rootScope.decodedToken.kitaid,
            }).then(function mySuccess(res) {
                res.data.forEach(element => {
                    //element.groupname
                    kitas.push({ value: element._id, name: element.groupname });
                });
            });
            $scope.kitas = kitas;           // pass the data into scope
            $scope.selected = kitas[0];    // show default value here for options

            $http({
                method: "POST",
                url: "action/getActions",
                data: {
                    "kitaid": $rootScope.decodedToken.kitaid
                }
            }).then(function mySuccess(res) {
                res.data.forEach(element => {
                    //element.groupname
                    actions.push({
                        '_id': element._id,
                        'name': element.name,
                        'uImage': element.uImage,
                        'kitaid': element.kitaid
                    });


                    //element.groupname
                    //    console.log("element value =>", element._id);
                    actionsArchive.push({ value: element._id, text: element.name });

                });

                $scope.actionsArchive = actionsArchive;

                actions.sort(function (a, b) {
                    return b.name - a.name;
                });

                $scope.actions = actions;

            });

        }
    });



    $scope.getDaily = function () {
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
                method: "POST",
                url: "daily/getDailysByKidCustome",
                data: {
                    "kitaid": $rootScope.decodedToken.kitaid,
                    "groupid": $rootScope.decodedToken.groupid,
                    "monthDate": $rootScope.dateDay
                }
            }).then(function mySuccess(res) {
                res.data.some(element => {

                    element.kids.some(kidDaily => {
                        if (kidDaily.username == $rootScope.decodedToken.username && element.datum == $rootScope.dateDay) {

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

                        return true;
                    } else {
                        $scope.hasDaily = false;
                    }

                });
                $scope.kidsDaily3 = kidsDaily3;
                $scope.count_kidsDaily3 = kidsDaily3.length;

                $("#fixTable").tableHeadFixer();
            }, function myError(response) {
                $scope.kidsDaily3 = [];
                $scope.count_kidsDaily3 = 999;
            });

        });
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

        $scope.getDaily();

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

        $scope.getDaily();

    }



    $scope.hasChanged = function () {
        //alert($scope.selected.name + "   " + $scope.selected.value);
        if ($scope.selectedDate != null || $scope.selectedDate != undefined) {
            d = $scope.selectedDate;
            selectedDay = weekday[d.getDay()];
            $scope.selectedDay = selectedDay;

            $scope.selectedDateIso = moment(d).format('DD.MM.YYYY').toString();
        }

        if ($scope.selected.value >= 0) {
            //Here we would like to show kid's info
            kidsDaily = [];

            $http({
                method: "POST",
                url: "daily/get",
                data: {
                    "datum": $scope.selectedDateIso,
                    "kitaid": $rootScope.decodedToken.kitaid,
                    "groupid": $scope.selected.value
                }
            }).then(function mySuccess(res) {
                if (res.data != null && res.data != undefined) {
                    res.data.kids.forEach(element => {
                        if (element.Status == "4" || element.Status == "3") {
                            kidsDaily.push({
                                'uImage': element.uImage,
                                'fullname': element.fullname,
                                'username': element.username,
                                'ActionNachm': element.ActionNachm,
                                'ActionMorgen': element.ActionMorgen,
                                'ActionSelMorgenSel': Number(element.ActionSelMorgenSel),
                                'ActionSelNachmSel': Number(element.ActionSelNachmSel),
                                'Schlafen': element.Schlafen,
                                'Essen': element.Essen,
                                'InfoAbend': element.InfoAbend,
                                'InfoMorgen': element.InfoMorgen,
                                'Status': element.Status,
                                'contenteditable': false,
                                'colorRow': { 'background-color': 'white' }
                            });
                            kidsDaily.sort(function (a, b) {
                                return b.Status - a.Status;
                            });

                        }
                    });
                    $scope.kidsDaily = kidsDaily;
                    $scope.count_kidsDaily = kidsDaily.length;

                } else {
                    $scope.kidsDaily = [];
                    $scope.count_kidsDaily = 999;

                }
            }, function myError(response) {
                $scope.kidsDaily = [];
                $scope.count_kidsDaily = 999;
            });
            $("#fixTable").tableHeadFixer();
            $("#fixTable2").tableHeadFixer();


            kids = [];

            $http({
                method: "GET",
                url: "user/getUsersByGroup/" + $scope.selected.value,
            }).then(function mySuccess(res) {
                res.data.forEach(element => {
                    kids.push({
                        'uImage': element.profilPathImg,
                        'fullname': element.first_name + " " + element.last_name,
                        'username': element.username
                    });
                });

                $scope.kids = kids;
                $scope.count_kids = kids.length;
            });
        } else {
            $scope.kids = [];
            $scope.count_kids = 999;
        }
    }

    $scope.edit = function () {
        $http({
            method: "PUT",
            url: "/kita/editKita",
            data: {
                "_id": $scope.kitaid,
                "kitaname": $scope.kitaname,
                "description": $scope.kitaDescription,
                "telefon": $scope.kitaTelefon,
                "email": $scope.kitaEmail,
                "ort": $scope.kitaOrt,
                "kanton": $scope.kitaKanton,
                "plz": $scope.kitaPlz,
                "address": $scope.kitaAddress
            }
        }).then(function mySuccess(response) {
            $rootScope.refreshedSite = 'kita';
            $state.go('sync');
            alertService.showNotificationSuccesUpdate();
        }, function myError(response) {
            alertService.showNotificationErrorUpdate();
        });
    }

    $scope.onOpenChat = function () {
        $(".chat-window").removeClass('ng-hide');
        $(".chat-window").css({ width: '300px', height: '500px', position: 'fixed', bottom: '20px', right: '20px', 'z-index': '999999' });
        $(".chatOnlineService").css({ display: 'none' });
    }


    $scope.showAction = function (action) {

        var i;
        for (i = 0; i < $scope.actions.length; i++) {
            this.actions[i].colorSelected = { 'background-color': 'none', 'color': 'black' };
        }

        this.action.colorSelected = { 'background-color': '#0074c2', 'color': 'white' };

        $rootScope.modalTitle = this.action.name;
        $rootScope.modalSuccesBtn = "Aktualisieren"
        $rootScope.modalLink = "updateActions";
        $rootScope.modalActionName = this.action.name;
        $rootScope.uImageAction = this.action.uImage;
        $rootScope.kitaidAction = this.action.kitaid;
        $rootScope._idAction = this.action._id;
        $('#Modal').modal('show');
    }

    $rootScope.updateAction = function (name, imageURL) {

        $http({
            method: "PUT",
            url: "action/updateAction",
            data: {
                "_id": $rootScope._idAction,
                "name": name,
                "uImage": imageURL,
                "kitaid": $rootScope.decodedToken.kitaid
            }
        }).then(function mySuccess(res) {
            $http({
                method: "POST",
                url: "action/getActions",
                data: {
                    "kitaid": $rootScope.decodedToken.kitaid
                }
            }).then(function mySuccess(res) {
                actions = [];
                res.data.forEach(element => {
                    //element.groupname
                    actions.push({
                        '_id': element._id,
                        'name': element.name,
                        'uImage': element.uImage,
                        'kitaid': element.kitaid
                    });
                });
                actions.sort(function (a, b) {
                    return b.name - a.name;
                });

                $scope.actions = actions;

            });
            $rootScope.refreshedSite = 'kitaActions';
            $state.go('sync');
        });
    }


    $rootScope.deleteAction = function () {

        $http({
            method: "GET",
            url: "action/deleteAction/" + $rootScope._idAction
        }).then(function mySuccess(res) {
            $http({
                method: "POST",
                url: "action/getActions",
                data: {
                    "kitaid": $rootScope.decodedToken.kitaid
                }
            }).then(function mySuccess(res) {
                actions = [];
                res.data.forEach(element => {
                    //element.groupname
                    actions.push({
                        '_id': element._id,
                        'name': element.name,
                        'uImage': element.uImage,
                        'kitaid': element.kitaid
                    });
                });
                actions.sort(function (a, b) {
                    return b.name - a.name;
                });

                $scope.actions = actions;
            });

            $rootScope.refreshedSite = 'kitaActions';
            $state.go('sync');
        });
    }

    $scope.createAction = function () {

        $scope.uploading = true;
        $scope.uploadSuccess = false;
        if ($scope.actionName != undefined) {
            if ($rootScope.croppedImageAction != null && $rootScope.croppedImageAction != undefined) {

                var imageBase64 = $rootScope.croppedImageAction;
                var blob = $scope.dataURItoBlob(imageBase64);
                var image = new File([blob], 'temp.png');

                uploadFileService.uploadAction(image, $scope.actionName).then(function (data) {
                    if (data.data.success) {
                        $scope.uploading = false;
                        $scope.alertUpload = '';
                        $scope.message = "";
                        $http({
                            method: "POST",
                            url: "/action/setAction",
                            data: {
                                "name": $scope.actionName,
                                "uImage": "assets/img/actions/" + data.data.file.filename,
                                "kitaid": $rootScope.decodedToken.kitaid
                            }
                        }).then(function success(response) {
                            $scope.uploadSuccess = true;
                            fileArray = {};
                            $scope.file = {};


                            alertService.showNotificationSuccesCreateAction($scope.actionName);

                            $http({
                                method: "POST",
                                url: "action/getActions",
                                data: {
                                    "kitaid": $rootScope.decodedToken.kitaid
                                }
                            }).then(function mySuccess(res) {
                                actions = [];
                                res.data.forEach(element => {
                                    //element.groupname
                                    actions.push({
                                        '_id': element._id,
                                        'name': element.name,
                                        'uImage': element.uImage,
                                        'kitaid': element.kitaid
                                    });
                                });
                                actions.sort(function (a, b) {
                                    return b.name - a.name;
                                });

                                $scope.actions = actions;
                                $scope.actionName = "";

                            });



                        });

                    } else {
                        alertService.showNotificationErrorCreateAction($scope.actionName);
                        $scope.uploading = false;
                        $scope.alertUpload = 'alert alert-danger';
                        $scope.message = data.data.message;
                        fileArray = {};
                        $scope.file = {};
                    }
                })
            } else {
                alertService.showNotificationErrorCreateAction($scope.actionName);
                $scope.uploading = false;
                $scope.alertUpload = 'alert alert-danger';
                $scope.message = "Kein Bild ausgewählt!";
                fileArray = {};
                $scope.file = {};

            }
        } else {
            $scope.uploading = false;
            $scope.alertUpload = 'alert alert-danger';
            $scope.message = "Der Name der Aktivität ist leer!";
            fileArray = {};
            $scope.file = {};
            $scope.actionName = "";
        }



    }

    // Assign blob to component when selecting a image
    $('#upload').on('change', function () {
        var input = this;

        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                // bind new Image to Component
                $scope.$apply(function () {
                    $scope.cropped.source = e.target.result;
                });
            }

            reader.readAsDataURL(input.files[0]);
        }
    });

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

    $scope.newKitaIMG = function () {
        $scope.newKitaIMGbol = true;
    }

    $scope.updateKitaIMG = function (url) {

        $http({
            method: "PUT",
            url: "/kita/editKitaImg",
            data: {
                "_id": $scope.kitaid,
                "uImageKita": url
            }
        }).then(function success(response) {
            $scope.uploading = false;
            $scope.uploadSuccess = true;
            $scope.uImageKita = url;
            $scope.newKitaIMGbol = false;
            alertService.showNotificationSuccesEditKitaImg();
        }, function myError(response) {
            alertService.showNotificationErrorEditKitaImg();
        });
    }

    $scope.uploadKitaIMG = function () {

        if ($rootScope.croppedImageKita != undefined && $scope.newKitaIMGbol == true) {
            $scope.uploading = true;
            $scope.uploadSuccess = false;
            var imageBase64 = $rootScope.croppedImageKita;
            var blob = $scope.dataURItoBlob(imageBase64);
            var image = new File([blob], 'temp.png');
            uploadFileService.uploadKita(image, angular.element('#NameActionNew').val()).then(function (data) {
                $scope.updateKitaIMG("assets/img/kitas/" + data.data.file.filename);
                $scope.newActionIMGbol = false;
            });
        } else {
            alertService.showNotificationErrorEditKitaImg();
        }
    }


    $scope.dataURItoBlob = function (dataURI) {
        var byteString = atob(dataURI.toString().split(',')[1]);

        //var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        var blob = new Blob([ab], { type: 'image/png' }); //or mimeString if you want
        return blob;
    }
});
angular.module('kita').controller('loadKitaModalDataCtrl', function ($rootScope, $filter, $scope, $http, $state, alertService, uploadFileService, $timeout, $window) {

    $scope.file = {};
    $scope.userSelected = false;
    var kids = [];
    var actions = [];
    var croppedImage = "";
    $rootScope.kidAddSelected = false;

    $scope.cropped = {
        source: 'assets/img/default.png'
    };

    $("#Modal").on("hidden.bs.modal", function () {
        $rootScope.modalTitle = null;
        $rootScope.modalSuccesBtn = null;
        $rootScope.modalLink = null;
        $rootScope.modalBody = null;
        $rootScope.eventName = null;
        $rootScope.startTime = null;
        $rootScope.endTime = null;
        $rootScope.startDate = null;
        $rootScope.endDate = null;
        $rootScope.eventId = null;
        $rootScope.modalLink2 = null;
        $rootScope.eventTitle = null;
    });

    $scope.newActionIMGbol = false;

    angular.element(document).ready(function () {
        if ($rootScope.modalLink == "dailyStatusAddKids") {

            $http({
                method: "POST",
                url: "user/getUsersByGroupIdReverse/" + $rootScope.groupIdselected,
                data: {
                    "datum": $rootScope.dateDay,
                    "kitaid": $rootScope.decodedToken.kitaid,
                    "kids": $rootScope.kidsSelected
                }
            }).then(function mySuccess(res) {
                if (res.data != null && res.data != undefined) {
                    res.data.forEach(element => {
                        kids.push({
                            'uImage': element.profilPathImg,
                            'fullname': element.first_name + " " + element.last_name,
                            'username': element.username
                        });
                    });

                    $scope.kidsRest = kids;
                }
            });
        }else if($rootScope.modalLink == "updateActions"){
            cropped.image = null;
        }else if($rootScope.modalLink == "dailyStatusAddActions"){
            $http({
                method: "POST",
                url: "action/getActions",
                data : {"kitaid": $rootScope.decodedToken.kitaid}
            }).then(function mySuccess(res) {
                res.data.forEach(element => {
                    //element.groupname
                    //    console.log("element value =>", element._id);
                    actions.push({ value: element._id, text: element.name });
                });
                $rootScope.actionNames = actions;
            });
    
            $scope.actions = actions;           // pass the data into scope
    
        }
    });


    $scope.$watch('cropped.image', function (nVal) {
        if (nVal) {
            $rootScope.croppedImage = nVal;
        }
    });

    $scope.$watch('cropped.image', function (nVal) {
        if (nVal) {
            $rootScope.croppedImageAction = nVal;
        }
    });


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

    $scope.newActionIMG = function(){
        $scope.newActionIMGbol = true;
    }

    $scope.SubmitProfilImg = function () {
        $scope.uploading = true;
        $scope.uploadSuccess = false;

        if ($rootScope.croppedImage != null && $rootScope.croppedImage != undefined) {

            var imageBase64 = $rootScope.croppedImage;
            var blob = $scope.dataURItoBlob(imageBase64);
            var image = new File([blob], 'temp.png');

            uploadFileService.upload(image).then(function (data) {
                if (data.data.success) {
                    $scope.uploading = false;
                    $scope.alertUpload = 'alert alert-success';
                    $scope.message = data.data.message;
                    $http({
                        method: "PUT",
                        url: "/user/edit/profilImage",
                        data: {
                            "username": $rootScope.decodedToken.username,
                            "profilPathImg": "assets/img/profil_picture/" + data.data.file.filename
                        }
                    }).then(function success(response) {
                        $scope.uploadSuccess = true;
                        fileArray = {};
                        $scope.file = {};
                        $rootScope.decodedToken.profilPathImg = "assets/img/profil_picture/" + data.data.file.filename;
                        $window.sessionStorage.setItem("decodedToken", JSON.stringify($rootScope.decodedToken));
                    }, function myError(response) {
                        alertService.showNotificationErrorEditProfilImg();
                    });

                } else {
                    $scope.uploading = false;
                    $scope.alertUpload = 'alert alert-danger';
                    $scope.message = data.data.message;
                    fileArray = {};
                    $scope.file = {};
                }
            })

        } else {
            $scope.uploading = false;
            $scope.alertUpload = 'alert alert-danger';
            $scope.message = "Kein Bild ausgewählt!";
            fileArray = {};
            $scope.file = {};
        }
    }


    $scope.editPwConfirm = function () {
        $http({
            method: "PUT",
            url: "/user/editPw",
            data: {
                "username": $rootScope.username,
                "newPw": $rootScope.newPw
            }
        }).then(function mySuccess(response) {
            $rootScope.refreshedSite = 'profil';
            $state.go('sync');
            alertService.showNotificationSuccesPwChange();
        }, function myError(response) {
            alertService.showNotificationErrorPwChange();
        });

        $scope.oldPw = null;
        $scope.newPw = null;
        $scope.newPw2 = null;
    }

    $scope.resetPWconfirm = function(){
        $http({
            method: "PUT",
            url: "/user/resetPw",
            data: {
                "username": $rootScope.username,
                "newPw": $rootScope.newPwADM
            }
        }).then(function mySuccess(response) {

            console.log(response);

            console.log($rootScope.newPwADM);

            $rootScope.newPwADM = "";
            $rootScope.refreshedSite = 'editUser';
            $state.go('sync');
            alertService.showNotificationSuccesPwChange();
        }, function myError(response) {
            alertService.showNotificationErrorPwChange();
        });
    }

    $scope.setStatusOffline = function () {
        var status = 3;

        $rootScope.changeStatus($rootScope.modalFullname, $rootScope.uImage, $rootScope.username, status);

    }

    $scope.setStatusOnline = function () {
        var status = 1;

        $rootScope.changeStatus($rootScope.modalFullname, $rootScope.uImage, $rootScope.username, status);
    }

    $scope.setStatusLeave = function () {
        var status = 4;
        
        $rootScope.changeStatus($rootScope.modalFullname, $rootScope.uImage, $rootScope.username, status);
    }

    $scope.setStatusNeutral = function () {
        var status = 2;

        $rootScope.changeStatus($rootScope.modalFullname, $rootScope.uImage, $rootScope.username, status);
    }

    $scope.createUserPDF = function(bCreate){
        if(bCreate){
        $rootScope.createUserPDF($rootScope.password, $rootScope.username, $rootScope.kitaname);
        }
        $rootScope.refreshedSite = 'register';
        $state.go('sync');
    }



    $scope.dailyStatusAddKids = function () {
        $rootScope.AddKids($rootScope.usernameSelected, $rootScope.uiImageSelected, $rootScope.fullnameSelected);

        $rootScope.kidsSelected.push($rootScope.usernameSelected);

        $http({
            method: "POST",
            url: "user/getUsersByGroupIdReverse/" + $rootScope.groupIdselected,
            data: {
                "datum": $rootScope.dateDay,
                "kitaid": $rootScope.decodedToken.kitaid,
                "kids": $rootScope.kidsSelected
            }
        }).then(function mySuccess(res) {
            if (res.data != null && res.data != undefined) {
                res.data.forEach(element => {
                    kids.push({
                        'uImage': element.profilPathImg,
                        'fullname': element.first_name + " " + element.last_name,
                        'username': element.username
                    });
                });

                $scope.kidsRest = kids;
            }
        });

        $rootScope.usernameSelected = null;
        $rootScope.uiImageSelected = null;
        $rootScope.fullnameSelected = null;
        $rootScope.modalLink2 = null;

    }


    $scope.selectKid = function (kid) {

        var i;
        for (i = 0; i < $scope.kidsRest.length; i++) {
            this.kidsRest[i].colorSelected = { 'background-color': 'none', 'color': 'black' };
        }

        this.kid.colorSelected = { 'background-color': '#0074c2', 'color': 'white' };

        $rootScope.usernameSelected = this.kid.username;
        $rootScope.uiImageSelected = this.kid.uImage;
        $rootScope.fullnameSelected = this.kid.fullname;

        $scope.userSelected = true;

        $rootScope.kidAddSelected = true;
    }


    $scope.editUserConfirm = function () {

        console.log($rootScope.first_name);
        console.log($rootScope.last_name);

        $http({
            method: "PUT",
            url: "/user/edit",
            data: {
                "username": $rootScope.username,
                "first_name": $rootScope.first_name,
                "last_name": $rootScope.last_name,
                "address": $rootScope.address,
                "plz": $rootScope.plz,
                "ort": $rootScope.ort,
                "birth_date": $rootScope.birth_date,
                "telefon": $rootScope.telefon,
                "email": $rootScope.email,
                "groupid": $rootScope.groupid,
                "description": $rootScope.description,
                "vorlieben": $rootScope.vorlieben,
                "essenAllerg": $rootScope.essenAllerg,
                "Montag": $rootScope.montag,
                "Dienstag": $rootScope.dienstag,
                "Mittwoch": $rootScope.mittwoch,
                "Donnerstag": $rootScope.donnerstag,
                "Freitag": $rootScope.freitag,
            }
        }).then(function mySuccess(response) {
            $rootScope.refreshedSite = 'editUser';
            $scope.resetRootScope();
            $state.go('sync');
            alertService.showNotificationSuccesEditUser($rootScope.username);
        }, function myError(response) {
            alertService.showNotificationErrorEditUser();
        });
    }

    $scope.deleteUserConfirm = function () {
        $http({
            method: "GET",
            url: "/user/delete/" + $rootScope.userid
        }).then(function mySuccess(response) {
            $rootScope.refreshedSite = 'editUser';
            $scope.resetRootScope();
            $state.go('sync');
            alertService.showNotificationSuccesUserDelete($rootScope.username);
        }, function myError(response) {
            alertService.showNotificationErrorUserDelete();
        });
    }

    $scope.editProfilPicConfirm = function () {
        $scope.message = null;
        $scope.uploadSuccess = false;
        $rootScope.refreshedSite = 'profil';
        $state.go('sync');
        alertService.showNotificationSuccesEditProfilImg();

    }

    $scope.hasChanged = function () { // This part is selected tag in modal ( here is modal view controller :) 
        $rootScope.groupSelect = $scope.groupNamesKita;
    }

    $rootScope.changeOption = function (optValue) {  // This is rootScope function, cooperated with calender controller :)
        $scope.groupNamesKita = optValue;
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

    $scope.resetRootScope = function () {
        $rootScope.modalTitle = null;
        $rootScope.modalSuccesBtn = null;
        $rootScope.modalBody = null;
        $rootScope.eventName = null;
        $rootScope.startTime = null;
        $rootScope.endTime = null;
        $rootScope.startDate = null;
        $rootScope.endDate = null;
        $rootScope.eventId = null;
        $rootScope.modalLink2 = null;
        $rootScope.eventTitle = null;
        $scope.groupNames = $rootScope.groupNames;
        if($rootScope.modalLink == "createUserPDF"){
            $rootScope.refreshedSite = 'register';
            $state.go('sync');
        }
        $rootScope.modalLink = null;

    }

    $scope.resetRootScope2 = function () {
        $rootScope.modalTitle = null;
        $rootScope.modalSuccesBtn = null;
        $rootScope.modalBody = null;
        $rootScope.eventName = null;
        $rootScope.startTime = null;
        $rootScope.endTime = null;
        $rootScope.startDate = null;
        $rootScope.endDate = null;
        $rootScope.eventId = null;
        $rootScope.modalLink2 = null;
        $rootScope.eventTitle = null;
        $scope.groupNames = $rootScope.groupNames;
    }


    $scope.updateAction = function () {
        if ($rootScope.croppedImageAction != undefined && $scope.newActionIMGbol == true) {
            var imageBase64 = $rootScope.croppedImageAction;
            var blob = $scope.dataURItoBlob(imageBase64);
            var image = new File([blob], 'temp.png');
            uploadFileService.uploadAction(image, angular.element('#NameActionNew').val()).then(function (data) {
                $rootScope.updateAction(angular.element('#NameActionNew').val(),"assets/img/actions/" + data.data.file.filename);
                $scope.newActionIMGbol = false;
            });
            
        }else {
            $rootScope.updateAction(angular.element('#NameActionNew').val(),$rootScope.uImageAction);
            $scope.newActionIMGbol = false;
            
        }

    }

    $scope.deleteAction = function () {
        $rootScope.deleteAction();
    }

    $scope.updateAllActionKids = function(){
        var ActionSelMorgSel = angular.element('#ActionSelMorgSel').val();
        var ActionSelNachmSel = angular.element('#ActionSelNachmSel').val();

        $rootScope.addActions(ActionSelMorgSel,ActionSelNachmSel);

    }

});
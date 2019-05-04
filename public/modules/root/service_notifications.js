angular.module('iKita').service('alertService', function () {

    this.showNotificationSuccesLogin = function () {

        $.notify({
            icon: "pe-7s-smile",
            message: "Wilkommen zurück! Sie haben sich erfolgreich angemeldet."
        }, {
                type: 'success',
                timer: 2000,
                placement: {
                    from: 'top',
                    align: 'center'
                }
            });
    }

    this.showNotificationInfoLogout = function () {

        $.notify({
            icon: "pe-7s-left-arrow",
            message: "Sie haben sich erfolgreich abgemeldet."
        }, {
                type: 'info',
                timer: 2000,
                placement: {
                    from: 'top',
                    align: 'center'
                }
            });
    }

    this.editKidDataSuccess = function(){
        $.notify({
            icon: "pe-7s-check",
            message: "Die Daten wurden erfolgreich gespeichert."
        }, {
                type: 'success',
                timer: 2000,
                placement: {
                    from: 'top',
                    align: 'center'
                }
            });
    }

    this.editKidDataError = function(){
        $.notify({
            icon: "pe-7s-attention",
            message: "Ein Fehler ist beim speichern der Daten aufgetreten."
        }, {
                type: 'danger',
                timer: 2000,
                placement: {
                    from: 'top',
                    align: 'center'
                }
            });
    }

    this.showNotificationErrorLogin = function () {

        $.notify({

            icon: "pe-7s-attention",
            message: "Benutzername/Passwort sind nicht korrekt!"
        }, {
                type: 'danger',
                timer: 2000,
                placement: {
                    from: 'top',
                    align: 'center'
                }
            });
    }


    this.showNotificationSuccesRegister = function (username) {

        $.notify({
            icon: "pe-7s-check",
            message: "Der Benutzer " + username + " wurde erfolgreich registriert."
        }, {
                type: 'success',
                timer: 2000,
                placement: {
                    from: 'top',
                    align: 'center'
                }
            });
    }


    this.showNotificationErrorRegister = function () {

        $.notify({

            icon: "pe-7s-attention",
            message: "Ein Fehler ist aufgetreten! Der Benutzer konnte nicht registriert werden, bitte überprüfen Sie Ihre Angaben."
        }, {
                type: 'danger',
                timer: 2000,
                placement: {
                    from: 'top',
                    align: 'center'
                }
            });
    }

    this.showNotificationSuccesUpdate = function () {

        $.notify({

            icon: "pe-7s-check",
            message: "Die Kita-Daten wurden erfolgreich aktualisiert."
        }, {
                type: 'info',
                timer: 2000,
                placement: {
                    from: 'top',
                    align: 'center'
                }
            });
    }

    this.showNotificationErrorUpdate = function () {

        $.notify({

            icon: "pe-7s-attention",
            message: "Ein Fehler ist beim Updaten der Daten aufgetreten!"
        }, {
                type: 'danger',
                timer: 2000,
                placement: {
                    from: 'top',
                    align: 'center'
                }
            });
    }

    this.showNotificationSuccesEditUser = function (username) {

        $.notify({

            icon: "pe-7s-check",
            message: "Der User " + username + " wurden erfolgreich aktualisiert."
        }, {
                type: 'info',
                timer: 2000,
                placement: {
                    from: 'top',
                    align: 'center'
                }
            });
    }

    this.showNotificationErrorEditUser = function () {

        $.notify({

            icon: "pe-7s-attention",
            message: "Ein Fehler ist beim Editieren des Users aufgetreten!"
        }, {
                type: 'danger',
                timer: 2000,
                placement: {
                    from: 'top',
                    align: 'center'
                }
            });
    }


    this.showNotificationSuccesUserDelete = function (username) {

        $.notify({

            icon: "pe-7s-check",
            message: "Der User " + username + " wurden erfolgreich gelöscht."
        }, {
                type: 'info',
                timer: 2000,
                placement: {
                    from: 'top',
                    align: 'center'
                }
            });
    }

    this.showNotificationErrorUserDelete = function () {

        $.notify({

            icon: "pe-7s-attention",
            message: "Ein Fehler ist beim Löschen des Users aufgetreten!"
        }, {
                type: 'danger',
                timer: 2000,
                placement: {
                    from: 'top',
                    align: 'center'
                }
            });
    }

    this.showNotificationSuccesEditProfil = function () {
        $.notify({

            icon: "pe-7s-check",
            message: "Ihr Profil wurden erfolgreich aktualisiert."
        }, {
                type: 'info',
                timer: 2000,
                placement: {
                    from: 'top',
                    align: 'center'
                }
            });
    }


    this.showNotificationSuccesEditProfilImg = function () {
        $.notify({

            icon: "pe-7s-check",
            message: "Ihr Profilbild wurde erfolgreich aktualisiert."
        }, {
                type: 'info',
                timer: 2000,
                placement: {
                    from: 'top',
                    align: 'center'
                }
            });
    }

    this.showNotificationErrorEditProfilImg = function () {

        $.notify({

            icon: "pe-7s-attention",
            message: "Ein Fehler ist beim aktualisieren des Profilbilds aufgetreten!"
        }, {
                type: 'danger',
                timer: 2000,
                placement: {
                    from: 'top',
                    align: 'center'
                }
            });
    }

    this.showNotificationSuccesEditKitaImg = function () {
        $.notify({

            icon: "pe-7s-check",
            message: "Ihr Kitabild wurde erfolgreich aktualisiert."
        }, {
                type: 'info',
                timer: 2000,
                placement: {
                    from: 'top',
                    align: 'center'
                }
            });
    }

    this.showNotificationErrorEditKitaImg = function () {

        $.notify({

            icon: "pe-7s-attention",
            message: "Ein Fehler ist beim aktualisieren des Kitabildes aufgetreten!"
        }, {
                type: 'danger',
                timer: 2000,
                placement: {
                    from: 'top',
                    align: 'center'
                }
            });
    }

    this.showNotificationSuccesSendFeedback = function () {

        $.notify({

            icon: "pe-7s-paper-plane",
            message: "Das Feedback wurde erfolgreich übermittelt!"
        }, {
                type: 'success',
                timer: 1500,
                placement: {
                    from: 'top',
                    align: 'center'
                }
            });
    }

    this.showNotificationFailedSendFeedback = function () {

        $.notify({

            icon: "pe-7s-paper-plane",
            message: "Bitte überprüfen Sie alle Felder im Formular!"
        }, {
                type: 'danger',
                timer: 1000,
                placement: {
                    from: 'top',
                    align: 'center'
                }
            });
    }

    this.showNotificationSuccesPwChange = function () {
        $.notify({

            icon: "pe-7s-paper-plane",
            message: "Das Passwort wurde erfolgreich geändert."
        }, {
                type: 'success',
                timer: 1500,
                placement: {
                    from: 'top',
                    align: 'center'
                }
            });
    }


    this.showNotificationErrorPwChange = function () {

        $.notify({

            icon: "pe-7s-paper-plane",
            message: "Ein Fehler ist beim Ändern des Passworts aufgetreten!"
        }, {
                type: 'danger',
                timer: 1000,
                placement: {
                    from: 'top',
                    align: 'center'
                }
            });
    }


    this.addkidSuccess = function (fullname) {

        $.notify({

            icon: "pe-7s-add-user",
            message: fullname + " wurde erfolgreich im Tagesheft hinzugefügt."
        }, {
                type: 'success',
                timer: 1500,
                placement: {
                    from: 'top',
                    align: 'center'
                }
            });
    }

    this.addkidError = function(fullname) {

        $.notify({

            icon: "pe-7s-add-user",
            message: "Ein Fehler ist beim hinzufügen von " + fullname + " ins Tagesheft aufgetreten!"
        }, {
                type: 'danger',
                timer: 1000,
                placement: {
                    from: 'top',
                    align: 'center'
                }
            });
    }

    this.showNotificationSuccesCreateAction = function (name) {

        $.notify({

            icon: "pe-7s-pen",
            message: name + " wurde erfolgreich in die Aktivitätenliste hinzugefügt."
        }, {
                type: 'success',
                timer: 1500,
                placement: {
                    from: 'top',
                    align: 'center'
                }
            });
    }


    this.showNotificationErrorCreateAction = function(name) {

        $.notify({

            icon: "pe-7s-pen",
            message: "Ein Fehler ist beim hinzufügen der Aktivität " + name + " aufgetreten!"
        }, {
                type: 'danger',
                timer: 1000,
                placement: {
                    from: 'top',
                    align: 'center'
                }
            });
    }
    

});
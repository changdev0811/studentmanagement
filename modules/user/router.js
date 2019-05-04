var express = require('express');
var router = express.Router();
var _create = require('./ctl_register.js');
var _update = require('./ctl_edit.js');
var _remove = require('./ctl_delete.js');
var _getUser = require('./ctl_getUser.js');
var _tokenCheck = require('../../config/auth_token.js');
var _admin = require('./ctl_adminuser.js');
var _allusers = require('./ctl_getalluser.js');

// Check Username
router.post('/checkUsername', _create.checkUsername);

// Get Users By GroupId
router.get('/getUsersByGroup/:groupid', _getUser.getUsersByGroupId);

// Get User By Id
router.get('/getUserDataById/:userid', _getUser.getUserDataById);

// Register
router.post('/register', _create.register);

// Edit
router.put('/edit', _update.edit);

router.put('/editUser', _update.editUser);

// Edit Passwort
router.put('/editPw', _update.editPw);

//Reset Passwort
router.put('/resetPw', _update.resetPw);

// Set User active
router.put('/setActive', _update.setActive);

router.put('/setOffline', _update.setOffline);

// Delete
router.get('/delete/:userid', _remove.delete);

// Edit Profil Img
router.put('/edit/profilImage', _update.editProfilImg);

// Get Token
router.get('/getToken/:token', _getUser.getToken);

//router.get('/status', _getUser.getUserStatus);

// Get Admin Info
router.get('/getAdminData', _admin.adminUser);

// Get all admin info using same kitaID
router.post('/getAllAdminData', _admin.allAdmin);

// Get all users info using same KitaID
router.post('/getAllUsersData', _allusers.getAllUsersData);

// Get all users info using same KitaID
router.post('/getAllUsersDataActive', _allusers.getAllUsersDataActive);

// Get all users info using same GroupId
router.post('/getUsersByGroupIdReverse/:groupid', _getUser.getUsersByGroupIdReverse);

router.post('/getUsersByGroupIdandDay/:groupid', _getUser.getUsersByGroupIdandDay);

// Get All Users
router.get('/getAllUsers', _allusers.getAllUsers);

module.exports = router;
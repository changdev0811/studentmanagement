var express = require('express');
var router = express.Router();
var _read = require('./ctl_login.js');


// Login
router.post('/login', _read.login);

module.exports = router;
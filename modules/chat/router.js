var express = require('express');
var router = express.Router();
var _eventOpt = require('./ctl_chat.js');

router.post('/send', _eventOpt.send);
router.post('/getMessage', _eventOpt.getAllData);
router.post('/getAllMessage', _eventOpt.getAllMessage);

module.exports = router;
var express = require('express');
var router = express.Router();
var _eventOpt = require('./smsNotify.js');

router.post('/addNotifyNumber', _eventOpt.addNotifyNumber);
router.post('/getNotifyNumber', _eventOpt.getNotifyNumber);
router.post('/deleteNotifyNumber', _eventOpt.deleteNotifyNumber);

module.exports = router;
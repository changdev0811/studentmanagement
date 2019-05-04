var express = require('express');
var router = express.Router();
var _eventOpt = require('./ctl_feedback.js');

router.post('/createFeedback', _eventOpt.createFeedback);
router.post('/getFeedback', _eventOpt.getFeedback);
router.post('/getFeedbackUnread', _eventOpt.getFeedbackUnread);
router.post('/updateFeedback', _eventOpt.updateFeedback);

module.exports = router;
var express = require('express');
var router = express.Router();
var _eventOpt = require('./ctl_calendar.js');


// Get Events By GroupId
router.get('/getEventsByGroup/:groupid', _eventOpt.getEventsByGroupId);

// Get Events By KitaId
//router.get('/getEventsByGroup/:kitaid', _eventOpt.getEventsByKitaId);

// New
router.post('/newEvent', _eventOpt.newEvent);

// Edit
router.put('/editEvent', _eventOpt.editEvent);

// Delete
router.get('/deleteEvent/:eventId', _eventOpt.deleteEvent);

module.exports = router;
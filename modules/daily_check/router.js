var express = require('express');
var router = express.Router();
var _daily = require('./ctl_daily.js');


// Check
router.post('/get', _daily.getDaily);

router.put('/getDailyByKids', _daily.getDailysByKid);

router.post('/getDailyKidsRest', _daily.getDailyKidsRest);

router.post('/getDailysByKidCustome', _daily.getDailysByKidCustome);

// Set Daily
router.put('/set', _daily.setDaily);

// Set DailyKids
router.put('/setKids', _daily.setDailyKids); 

// Set DailyKids
router.put('/setKidsData', _daily.setDailyKidsData);

router.put('/setKidsStatus', _daily.setDailyKidsStatus);

router.put('/setDailyKidsKommen', _daily.setDailyKidsKommen);

router.put('/setDailyKidsGehen', _daily.setDailyKidsGehen);

router.put('/setDailyKidsHours', _daily.setDailyKidsHours);


module.exports = router;
var express = require('express');
var router = express.Router();
var _kita = require('./ctl_kita.js');
var jwt = require('express-jwt');


// KitaId suchen
router.get('/searchId/:kitaid', _kita.findObjKita);

// Kita registrieren
router.post('/register', _kita.registerKita);

// Kita editieren
router.put('/editKita', _kita.editKita);

router.put('/editKitaImg', _kita.editKitaImg);

module.exports = router;


var express = require('express');
var router = express.Router();
var _action = require('./ctl_action.js');


// Check
router.post('/getActions', _action.getActions);

router.put('/updateAction', _action.updateAction);

router.post('/setAction', _action.setAction);

// Delete
router.get('/deleteAction/:_id', _action.deleteAction);

module.exports = router;
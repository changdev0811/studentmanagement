var DailySchema = require('../schemas/daily_check_schema.js');
var bcrypt = require('bcryptjs');

module.exports.setDaily = function (req, res) {

    DailySchema.update({ 'datum': req.body.datum, 'kitaid': req.body.kitaid, 'groupid': req.body.groupid }, req.body.kidsTemplate, { upsert: true }, function (err, doc) {
        if (err) {
            res.status(401).json(err);
        }
        res.status(201).json(doc); 
    });

}

module.exports.setDailyKids = function (req, res) {
    var kid = {
        username: req.body.username,
        Status: "2",
        uImage: req.body.uImage,
        fullname: req.body.fullname,
        InfoMorgen: "",
        InfoAbend: "",
        Essen: "",
        kommen: null,
        gehen: null,
        Schlafen: "",
        ActionMorgen: "",
        ActionNachm: "",
        ActionSelMorgenSel: "",
        ActionSelNachmSel: "",
        dayType: ""
    }

    DailySchema.updateOne({ 'datum': req.body.datum, 'kitaid': req.body.kitaid, 'groupid': req.body.groupid }, { $push: { kids: kid } }, { upsert: true }, function (err, doc) {
        if (err) {
            res.status(401).json(err);
        }
        res.status(201).json(doc);
    });
}

module.exports.setDailyKidsData = function (req, res) {
    var kid = {
        username: req.body.username,
        InfoMorgen: req.body.InfoMorgen,
        InfoAbend: req.body.InfoAbend,
        Essen: req.body.Essen,
        kommen: req.body.kommen,
        gehen: req.body.gehen,
        Schlafen: req.body.Schlafen,
        ActionMorgen: req.body.ActionMorgen,
        ActionNachm: req.body.ActionNachm,
        ActionSelMorgenSel: req.body.ActionSelMorgenSel,
        ActionSelNachmSel: req.body.ActionSelNachmSel,
        dayType: req.body.dayType
    }

    DailySchema.updateOne({ 'datum': req.body.datum, 'kitaid': req.body.kitaid, 'groupid': req.body.groupid, 'kids.username': kid.username }, {
        $set: {
            'kids.$.InfoMorgen': kid.InfoMorgen,
            'kids.$.InfoAbend' : kid.InfoAbend,
            'kids.$.Essen' : kid.Essen,
            'kids.$.Schlafen' : kid.Schlafen,
            'kids.$.kommen': kid.kommen,
            'kids.$.gehen': kid.gehen,
            'kids.$.ActionMorgen' : kid.ActionMorgen,
            'kids.$.ActionNachm' : kid.ActionNachm,
            'kids.$.ActionSelMorgenSel' : kid.ActionSelMorgenSel,
            'kids.$.ActionSelNachmSel' : kid.ActionSelNachmSel,
            'kids.$.dayType' : kid.dayType,
        }}, function (err, doc) {
        if (err) {
            res.status(401).json(err);
        }
        res.status(201).json(doc);
    });
}

module.exports.setDailyKidsStatus = function (req, res) {
    var kid = {
        username: req.body.username,
        Status: req.body.Status
    }

    DailySchema.updateOne({ 'datum': req.body.datum, 'kitaid': req.body.kitaid, 'groupid': req.body.groupid, 'kids.username': kid.username }, {
        $set: {
            'kids.$.Status': kid.Status
        }}, function (err, doc) {
        if (err) {
            res.status(401).json(err);
        }
        res.status(201).json(doc);
    });
}

module.exports.setDailyKidsKommen = function (req, res) {
    var kid = {
        username: req.body.username,
        kommen: req.body.kommen,
        dayType: req.body.dayType
    }

    DailySchema.updateOne({ 'datum': req.body.datum, 'kitaid': req.body.kitaid, 'groupid': req.body.groupid, 'kids.username': kid.username }, {
        $set: {
            'kids.$.kommen': kid.kommen,
            'kids.$.dayType' : kid.dayType,
        }}, function (err, doc) {
        if (err) {
            res.status(401).json(err);
        }
        res.status(201).json(doc);
    });
}

module.exports.setDailyKidsGehen = function (req, res) {
    var kid = {
        username: req.body.username,
        gehen: req.body.gehen
    }

    DailySchema.updateOne({ 'datum': req.body.datum, 'kitaid': req.body.kitaid, 'groupid': req.body.groupid, 'kids.username': kid.username }, {
        $set: {
            'kids.$.gehen': kid.gehen
        }}, function (err, doc) {
        if (err) {
            res.status(401).json(err);
        }
        res.status(201).json(doc);
    });
}

module.exports.setDailyKidsHours = function (req, res) {
    var kid = {
        username: req.body.username,
        hoursActive: req.body.hoursActive
    }

    DailySchema.updateOne({ 'datum': req.body.datum, 'kitaid': req.body.kitaid, 'groupid': req.body.groupid, 'kids.username': kid.username }, {
        $set: {
            'kids.$.hoursActive': kid.hoursActive
        }}, function (err, doc) {
        if (err) {
            res.status(401).json(err);
        }
        res.status(201).json(doc);
    });
}


module.exports.getDaily = function (req, res) {


    DailySchema.findOne({ 'datum': req.body.datum, 'kitaid': req.body.kitaid, 'groupid': req.body.groupid }, function (err, doc) {

        if (err) {
            res.status(401).json(err);
        } else {
            res.status(201).json(doc);
        }

    });
}

module.exports.getDailyKidsRest = function (req, res) {


    DailySchema.findOne({ 'datum': req.body.datum, 'kitaid': req.body.kitaid, 'groupid': req.body.groupid, 'kids': { $not: req.body.kidsDaily } }, function (err, doc) {

        if (err) {
            res.status(401).json(err);
        } else {
            res.status(201).json(doc);
        }

    });
}


module.exports.getDailysByKid = function (req, res) {

    var kid = {
        username: req.body.username
    }

    DailySchema.find({'kitaid': req.body.kitaid, 'groupid': req.body.groupid,  'kids.username': kid.username}, function (err, doc) {

        if (err) {
            res.status(401).json(err);
        } else {
            res.status(201).json(doc);
        }

    });
}


module.exports.getDailysByKidCustome = function (req, res) {

    var monthDate;

    monthDate = req.body.monthDate.substr(3,7);

    DailySchema.find({'datum': { "$regex": monthDate, "$options": "i" }, 'kitaid': req.body.kitaid, 'groupid': req.body.groupid}, function (err, doc) {

        if (err) {
            res.status(401).json(err);
        } else {
            res.status(201).json(doc);
        }

    });
}




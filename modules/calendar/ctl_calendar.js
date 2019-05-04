var EventSchema = require('../schemas/event_schema.js');

module.exports.getEventsByGroupId = function (req, res) {

    EventSchema.find({ 'groupid': req.params.groupid }, function (err, events) {

        if (err) {
            res.status(401).json(err);
        } else {
            res.status(201).json(events);
        }
    })
} 

module.exports.editEvent = function (req, res) {

    var eventInfo = {
        title : req.body.title,
        start : req.body.start,
        end : req.body.end,
        color: req.body.color,
        textColor : req.body.textColor,
        userid : req.body.userId,
        username : req.body.userName,
        groupid : req.body.groupid
    }

    var query = { '_id': req.body.id }

    EventSchema.update(query, eventInfo, function (err, doc) {
        if (err) {
            res.status(401).json(err);
        }
        res.status(201).json(doc);
    })
}

module.exports.newEvent = function (req, res) {

    var eventInfo = {
        title: req.body.title,
        start: req.body.start,
        end:req.body.end,
        color: req.body.color,
        textColor: req.body.textColor,
        userid: req.body.userId,
        username : req.body.userName,
        groupid: req.body.groupid
    }

    EventSchema.create(eventInfo, function (err, doc) {
        if (err) {
            res.status(401).json(err);
        }
        res.status(201).json(doc);
    })

}

module.exports.deleteEvent = function (req, res) {

    EventSchema.findOne({ '_id': req.params.eventId }, function (err, doc) {
        if (err) {
            res.status(401).json({ message: 'Error event find' });
        } else {
            if (doc == null) {
                res.status(401).json({ message: 'null error', doc: doc });
            } else {
                doc.remove(function (err, doc) {
                    if (err) res.status(401).json({ message: 'Error deleted' });
                });
                res.status(201).json({ message: 'Successfully deleted' });
            }
        }
    })
}
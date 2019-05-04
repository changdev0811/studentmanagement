var ActionSchema = require('../schemas/action_schema.js');
var bcrypt = require('bcryptjs');


module.exports.updateAction = function (req, res) {
    var action = {
        name: req.body.name,
        uImage: req.body.uImage,
        kitaid: req.body.kitaid
    }

    ActionSchema.updateOne({ '_id': req.body._id }, action, function (err, doc) {
        if (err) {
            res.status(401).json(err);
        }
        res.status(201).json(doc);
    });
}

module.exports.setAction = function (req, res) {
    var action = {
        name: req.body.name,
        uImage: req.body.uImage,
        kitaid: req.body.kitaid
    }

    ActionSchema.create(action, function (err, doc) {
        if (err) {
            res.status(401).json(err);
        }
        res.status(201).json(doc);
    });
}

module.exports.getActions = function (req, res) {

    ActionSchema.find({ 'kitaid': req.body.kitaid }, function (err, doc) {
        if (err) {
            res.status(401).json(err);
        }
        res.status(201).json(doc);
    });
}

module.exports.deleteAction = function (req, res) {

    ActionSchema.findOne({'_id': req.params._id}, function (err, doc) {
        if (err) {
            res.status(401).json({ message: 'Error user find' });
        }else{
            if (doc == null) {
                res.status(401).json({ message: 'null error' , doc: doc});
            }else{
                doc.remove(function (err, doc) {
                    if (err)  res.status(401).json({ message: 'Error deleted' });
                });
                res.status(201).json({ message: 'Successfully deleted' });
            }
        }
    })
}


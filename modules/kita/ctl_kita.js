var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var KitaSchema = require('../schemas/kita_schema.js');


module.exports.registerKita = function (req, res) {

    var kitaInfo = {
        kitaname: req.body.kitaname,
        description: req.body.description,
        telefon: req.body.telefon || null,
        email: req.body.email || null,
        ort: req.body.ort || null,
        kanton: req.body.kanton || null,
        plz: req.body.plz || null,
        address: req.body.address || null
    }

    KitaSchema.create(kitaInfo, function (err, doc) {
        if (err) {
            res.status(401).json(err);
        }
        res.status(201).json(doc);
    })


}


module.exports.editKita = function (req, res) {

    var kitaInfo = {
        kitaname: req.body.kitaname,
        description: req.body.description,
        telefon: req.body.telefon || null,
        email: req.body.email || null,
        kanton: req.body.kanton || null,
        ort: req.body.ort || null,
        plz: req.body.plz || null,
        address: req.body.address || null
    }

    var query = { '_id': req.body._id };

    KitaSchema.update(query, kitaInfo, function (err, doc) {
        if (err) {
            res.status(401).json(err);
        }
        res.status(201).json(doc);
    });


}


module.exports.editKitaImg = function (req, res) {

    KitaSchema.updateOne({'_id': req.body._id}, {'uImageKita': req.body.uImageKita}, function (err, doc) {
        if (err) {
            res.status(401).json(err);
        }
        res.status(201).json(doc);
    })
}

module.exports.findObjKita = function (req, res) {

    KitaSchema.findOne({ '_id': req.params.kitaid }, function (err, kita) {
        var response = {
            status: 401,
            message: 'failed'
        }
        if (err) {
            response.status = 401;
            response.message = 'failed';
        } else {
            response.status = 201;
            response.message = kita;
        }
        res.status(response.status).json({ 'message': response.message });
    })
}
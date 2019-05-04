var UserSchema = require('../schemas/user_schema.js');
var bcrypt = require('bcryptjs');

module.exports.edit = function (req, res) {

    var userInfo;

    if (req.body.plz != null && req.body.plz != undefined && req.body.plz != "") {

        userInfo = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            address: req.body.address,
            plz: req.body.plz,
            ort: req.body.ort,
            birth_date: req.body.birth_date,
            telefon: req.body.telefon,
            description: req.body.description,
            vorlieben: req.body.vorlieben,
            essenAllerg: req.body.essenAllerg,
            email: req.body.email,
            groupid: req.body.groupid,
            Montag: req.body.Montag,
            Dienstag: req.body.Dienstag,
            Mittwoch: req.body.Mittwoch,
            Donnerstag: req.body.Donnerstag,
            Freitag: req.body.Freitag,
        }
    } else {
        userInfo = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            address: req.body.address,
            ort: req.body.ort,
            birth_date: req.body.birth_date,
            telefon: req.body.telefon,
            description: req.body.description,
            vorlieben: req.body.vorlieben,
            essenAllerg: req.body.essenAllerg,
            email: req.body.email,
            groupid: req.body.groupid,
            Montag: req.body.Montag,
            Dienstag: req.body.Dienstag,
            Mittwoch: req.body.Mittwoch,
            Donnerstag: req.body.Donnerstag,
            Freitag: req.body.Freitag,
        }
    }

    var query = { 'username': req.body.username.toLowerCase() }

    UserSchema.update(query, userInfo, function (err, doc) {
        if (err) {
            res.status(401).json(err);
        }
        res.status(201).json(doc);
    })
}

module.exports.editUser = function (req, res) {

    var userInfo;

    if (req.body.plz != null && req.body.plz != undefined && req.body.plz != "") {

        userInfo = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            address: req.body.address,
            plz: req.body.plz,
            ort: req.body.ort,
            birth_date: req.body.birth_date,
            telefon: req.body.telefon,
            description: req.body.description,
            vorlieben: req.body.vorlieben,
            essenAllerg: req.body.essenAllerg,
            email: req.body.email,
            groupid: req.body.groupid
        }
    } else {
        userInfo = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            address: req.body.address,
            ort: req.body.ort,
            birth_date: req.body.birth_date,
            telefon: req.body.telefon,
            description: req.body.description,
            vorlieben: req.body.vorlieben,
            essenAllerg: req.body.essenAllerg,
            email: req.body.email,
            groupid: req.body.groupid
        }
    }

    var query = { 'username': req.body.username.toLowerCase() }

    UserSchema.update(query, userInfo, function (err, doc) {
        if (err) {
            res.status(401).json(err);
        }
        res.status(201).json(doc);
    })

}

module.exports.editProfilImg = function (req, res) {
    var userInfo = {
        profilPathImg: req.body.profilPathImg
    }

    var query = { 'username': req.body.username.toLowerCase() }

    UserSchema.update(query, userInfo, function (err, doc) {
        if (err) {
            res.status(401).json(err);
        }
        res.status(201).json(doc);
    })
}


module.exports.editPw = function (req, res) {

    var newPw = req.body.newPw;
    var firstLogOnFalse = 1;
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(newPw, salt);

    var query = { 'username': req.body.username.toLowerCase() }

    UserSchema.update(query, { 'password': hash, 'newPwReset': "Password Changed", 'firstLogin': firstLogOnFalse, 'pwChange': 'false' },{multi:true}, function (err, doc) {
        if (err) {
            res.status(401).json(err);
        }
        res.status(201).json(doc);
    })
}

module.exports.resetPw = function (req, res) {

    var newPwReset = req.body.newPw;

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(req.body.newPw, salt);

    var query = { 'username': req.body.username.toLowerCase() }

    UserSchema.update(query, { 'password': hash, 'newPwReset': newPwReset, 'pwChange': 'true' },{multi:true}, function (err, doc) {
        if (err) {
            res.status(401).json(err);
        }
        res.status(201).json(doc);
    })
}

module.exports.setActive = function (req, res) {

    var query = { 'username': req.body.username.toLowerCase() }

    UserSchema.update(query, { 'isActive': true }, function (err, doc) {
        if (err) {
            res.status(401).json(err);
        }
        res.status(201).json(doc);
    })
}

module.exports.setOffline = function (req, res) {

    var query = { 'username': req.body.username.toLowerCase() }

    UserSchema.update(query, { 'isActive': false }, function (err, doc) {
        if (err) {
            res.status(401).json(err);
        }
        res.status(201).json(doc);
    })
}
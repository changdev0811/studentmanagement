var UserSchema = require('../schemas/user_schema.js');
var bcrypt = require('bcryptjs');

module.exports.register = function (req, res) {

    var standardPathimg = "assets/img/faces/face-0.jpg";

    var newPwReset = req.body.password;

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(req.body.password, salt);

    var firstLogOn = 0;
    var pwChange = 'true';

    var userInfo = {
        username: req.body.username.toLowerCase(),
        password: hash,
        newPwReset : newPwReset,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        address: req.body.address,
        birth_date: req.body.birth_date,
        telefon: req.body.telefon || null,
        description: req.body.description,
        vorlieben: req.body.vorlieben,
        essenAllerg: req.body.essenAllerg,
        email: req.body.email || null,
        usertype: req.body.usertype,
        profilPathImg: standardPathimg,
        kitaid: req.body.kitaid,
        groupid: req.body.groupid,
        firstLogin: firstLogOn,
        pwChange: pwChange,
        Montag: req.body.Montag,
        Dienstag: req.body.Dienstag,
        Mittwoch: req.body.Mittwoch,
        Donnerstag: req.body.Donnerstag,
        Freitag: req.body.Freitag,
        isActive: false
    }

    UserSchema.create(userInfo, function (err, doc) {
        if (err) {
            res.status(401).json(err);
        }
        res.status(201).json(doc);
    })

}

module.exports.checkUsername = function (req, res) {


    UserSchema.findOne({ 'username': req.body.username.toLowerCase() }, function (err, user) {

        if (err) {
            res.status(401).json(err);
        } else {
            res.status(201).json(user);
        }

    })
}


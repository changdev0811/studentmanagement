var UserSchema = require('../schemas/user_schema.js');

module.exports.adminUser = function (req, res) {
    UserSchema.findOne({'usertype': '1'}, function (err, doc) {
        if (err) {
            res.status(401).json({ message: 'Error user find' });
        }else{
            res.status(201).json(doc);
        }
    });
}

module.exports.allAdmin = function (req, res) {

    UserSchema.find({'usertype': '1', 'kitaid': req.body.kitaid }, function (err, docs) {
        if (err) {
            res.status(401).json({ message: 'Error user find' });
        }else{
            res.status(201).json(docs);
        }
    });
}
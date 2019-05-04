var UserSchema = require('../schemas/user_schema.js');

module.exports.getAllUsers = function (req, res) {
    
    UserSchema.find({'usertype': 0}, function (err, doc) {
        if (err) {
            res.status(401).json({ message: 'Error user find' });
        }else{
            res.status(201).json(doc);
        }
    })
}

module.exports.getAllUsersData = function (req, res) {
    
    UserSchema.find({'usertype': 0, 'kitaid': req.body.kitaID}, function (err, docs) {
        if (err) {
            res.status(401).json({ message: 'Error user find' });
        }else{
            res.status(201).json(docs);
        }
    })
}

module.exports.getAllUsersDataActive = function (req, res) {
    
    UserSchema.find({'usertype': 0, 'kitaid': req.body.kitaID, 'isActive' : "true"}, function (err, docs) {
        if (err) {
            res.status(401).json({ message: 'Error user find' });
        }else{
            res.status(201).json(docs);
        }
    })
}



module.exports.getAllUsersDataByDay = function (req, res) {
    var weekDay = req.params.weekDay;

    UserSchema.find({'usertype': 0, 'kitaid': req.body.kitaID, weekDay: true}, function (err, docs) {
        if (err) {
            res.status(401).json({ message: 'Error user find' });
        }else{
            res.status(201).json(docs);
        }
    })
}
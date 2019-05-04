var UserSchema = require('../schemas/user_schema.js');

module.exports.delete = function (req, res) {

    UserSchema.findOne({'_id': req.params.userid}, function (err, doc) {
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
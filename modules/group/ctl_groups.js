var GroupSchema = require('../schemas/group_schema.js');

module.exports.registerGroup = function (req, res) {
    
        var groupInfo = {
            groupname:   req.body.groupname,
            description: req.body.description,
            kitaid :  req.body.kitaid,
            calendarid : req.body.calendarid
        }
        
        GroupSchema.create(groupInfo, function(err, doc){
            if(err){
                res.status(401).json(err);
            }
            res.status(201).json(doc);
        })
}


module.exports.findGroupId = function (req, res) {
   
    GroupSchema.find({'kitaid': req.params.kitaid}, function(err, groups){
       
        if(err){
            res.status(401).json(err);
        }else{
            res.status(201).json(groups);
        } 
    })
}

module.exports.findGroupbyId = function (req, res) {
   
    GroupSchema.findOne({'_id': req.params.groupid}, function(err, groups){
       
        if(err){
            res.status(401).json(err);
        }else{
            res.status(201).json(groups);
        } 
    })
}
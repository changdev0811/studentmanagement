var smsNotifySchema = require('../schemas/smsnotify_schema.js');

/*
    senderid : data.senderid,
    sendername : data.sendername, 
    receiverid : data.receiverid,
    receivername : data.receivername

    -------------------------------------

    senderID : String,
    senderName : String,
    receiverID : String,
    receiverName : String,
    notifyCount : Number
*/
        
module.exports.addNotifyNumber = function (req, res) {
    /*
    smsNotifySchema.create(data, function(err, doc){
        if(err){
            res.status(401).json(err);
        }
       res.status(201).json(doc);
    });
    */

    smsNotifySchema.findOne({'senderID': req.body.senderid, 'receiverID' : req.body.receiverid }, function(err, doc){
        if(err){
            res.status(401).json(err);
        }
        if (!doc){
            // record create
            smsNotifySchema.create({
                senderID: req.body.senderid,
                senderName : req.body.sendername,
                receiverID : req.body.receiverid,
                receiverName : req.body.receivername,
                notifyCount : 0            
            });
        }else{
            // update record
            var updated_data = {
                senderID: req.body.senderid,
                senderName : req.body.sendername,
                receiverID : req.body.receiverid,
                receiverName : req.body.receivername,
                notifyCount : doc.notifyCount+1
            };

            smsNotifySchema.updateOne({'senderID': req.body.senderid, 'receiverID' : req.body.receiverid }, updated_data, function(err, doc){
                console.log("updated...");
            });
        }
    });

}

module.exports.getNotifyNumber = function (req, res) {
    
    smsNotifySchema.find({'receiverName' : req.body.receivername}, function(err, docs){
        if(err){
            res.status(401).json(err);
        }

        res.status(201).json(docs);
    });

}

module.exports.deleteNotifyNumber = function (req, res) {
    smsNotifySchema.deleteOne({'senderName' : req.body.sendername, 'receiverName' : req.body.receivername});
}
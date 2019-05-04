var ChatSchema = require('../schemas/chat_schema.js');

module.exports.send = function (req, res) {
    
    // var data = {
    //     sender : req.body.sender,
    //     recevier : req.body.recevier,
    //     message : req.body.message,
    //     type : "",
    //     link : "",
    //     linkData : "",
    //     date_time : req.body.date_time 
    // };

    var data = {
        sender : req.body.sender,
        recevier : req.body.recevier,
        message : req.body.message,
        date_time : req.body.date_time
    };

    //console.log("data from client =>", data);

    ChatSchema.create(data, function(err, doc){
        if(err){
            res.status(401).json(err);
        }
       res.status(201).json(doc);
    });
}

module.exports.getAllData = function (req, res) {
    var data = [];
    
    //console.log("here is search name", req.body.name);

    ChatSchema.find({}, function(err, docs){
        docs.forEach(function (document) {
            if (document.sender == req.body.name || document.recevier == req.body.name){

                data.push({'sender': document.sender, 'message' : document.message ,'date_time' : document.date_time});
                if(err){
                    res.status(401).json(err);
                }
               
            } 
        });
        res.status(201).json(data);
    });
}

module.exports.getAllMessage = function (req, res) {
    var data = [];
    
    ChatSchema.find({}, function(err, docs){
        docs.forEach(function (doc) {
            if ((doc.sender == req.body.sender && doc.recevier == req.body.rec) || (doc.sender == req.body.rec && doc.recevier == req.body.sender)){
                data.push({'sender': doc.sender, 'message': doc.message, 'date_time': doc.date_time});
            }

        });
        res.status(201).json(data);
    });
}
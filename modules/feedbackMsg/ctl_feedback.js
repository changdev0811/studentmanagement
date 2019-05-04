var feedbackSchema = require('../schemas/feedback_schema.js');

module.exports.createFeedback = function (req, res) {

    /*
        ------- db schema -------
        senderID : Number,
        senderName : String,
        senderImg : String,
        receiverID : Number,
        receiverName : String,
        feedbackTitle : String,
        feedbackContent : String,
        dateTime : Date,
        messageRead : {
            type : Boolean,
            default: 'NO'
        }

        --- req data -----
        fromId : $rootScope.decodedToken.userid,
        fromName : $rootScope.decodedToken.username,
        toId : receive_userid,
        toName : receive_username,
        fbTitle : $scope.fbtitle,
        fbContent : $scope.fbcontent,
        fbDate : currentdate
    */

    feedbackSchema.create({
        senderID : req.body.fromId,
        senderName : req.body.fromName,
        senderImg : req.body.fromImg,
        receiverID : req.body.toId,
        receiverName : req.body.toName,
        feedbackTitle : req.body.fbTitle,
        feedbackContent : req.body.fbContent,
        dateTime : req.body.fbDate
    }, function(err, doc){
        if(err){
            res.status(401).json(err);
        }
        res.status(201).json(doc);
    });

}

module.exports.getFeedback = function (req, res) {
    feedbackSchema.find({'receiverID': req.body.userID, 'receiverName': req.body.userName} , function(err, docs){
        if(err){
            res.status(401).json(err);
        }
        res.status(201).json(docs);
    });
}


module.exports.getFeedbackUnread = function (req, res) {
    feedbackSchema.find({'receiverID': req.body.userID, 'receiverName': req.body.userName, 'messageRead' : req.body.messageRead }, function(err, docs){
        if(err){
            res.status(401).json(err);
        }
        res.status(201).json(docs);
    });
}

module.exports.updateFeedback = function (req, res) {

    /*
    feedbackSchema.findOne({'senderName': req.body.senderName, 'feedbackTitle' : req.body.fb_title, 'feedbackContent' : req.body.fb_Content }, function(err, doc){
        doc.messageRead = true;
        feedbackSchema.updateOne({'senderName': req.body.senderName, 'feedbackTitle' : req.body.fbTitle, 'feedbackContent' : req.body.fbContent}, doc, function(err, docs){
            res.status(201).json(null);
        });
    });*/

    feedbackSchema.updateOne({'senderName': req.body.senderName, 'feedbackTitle' : req.body.fb_title, 'feedbackContent' : req.body.fb_Content }, {'messageRead' : true}, function(err, doc){
        res.status(201).json(doc);
    });

}
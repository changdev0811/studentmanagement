var mongoose = require('mongoose');
autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

autoIncrement.initialize(mongoose.connection);

var feedbackSchema = new Schema({

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
        default: 0
    }
    
});

feedbackSchema.plugin(autoIncrement.plugin, 'feedback');

module.exports = mongoose.model('feedback', feedbackSchema);
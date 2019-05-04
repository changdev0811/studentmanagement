var mongoose = require('mongoose');
autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

autoIncrement.initialize(mongoose.connection);

var smsNotifySchema = new Schema({

   senderID : String,
   senderName : String,
   receiverID : String,
   receiverName : String,
   notifyCount : Number

});

smsNotifySchema.plugin(autoIncrement.plugin, 'smsNotify');

module.exports = mongoose.model('smsNotify', smsNotifySchema);
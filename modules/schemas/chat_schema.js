var mongoose = require('mongoose');
autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

autoIncrement.initialize(mongoose.connection);

var chatSchema = new Schema({
  sender : String,
  recevier : String,
  message : String,
  type : String,
  link : String,
  linkData : String,
  date_time : Date
});

chatSchema.plugin(autoIncrement.plugin, 'Chat');

module.exports = mongoose.model('Chat', chatSchema);
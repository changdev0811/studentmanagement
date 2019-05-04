var mongoose = require('mongoose');
autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

autoIncrement.initialize(mongoose.connection);

var dailySchema = new Schema({
  datum: String,
  kids: [{
    username : String,
    fullname : String,
    Status : String,
    InfoMorgen : String,
    InfoAbend : String,
    Essen : String,
    Schlafen : String,
    ActionMorgen : String,
    ActionNachm : String,
    ActionSelMorgenSel: String,
    ActionSelNachmSel: String,
    kommen: String,
    gehen: String,
    hoursActive: Number,
    dayType : String,
    uImage : String
  }],
  kitaid:   Number,
  groupid: Number
});

dailySchema.plugin(autoIncrement.plugin, 'Daily');

module.exports = mongoose.model('Daily', dailySchema);
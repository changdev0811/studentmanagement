var mongoose = require('mongoose');
autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

autoIncrement.initialize(mongoose.connection);

var groupSchema = new Schema({
  groupname:  {
      type: String,
      required : true
  },
  description: {
      type: String,
      required : true
  },
  kitaid:   Number
});

groupSchema.plugin(autoIncrement.plugin, 'Group');

module.exports = mongoose.model('Group', groupSchema);
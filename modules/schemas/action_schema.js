var mongoose = require('mongoose');
autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

autoIncrement.initialize(mongoose.connection);

var actionSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  uImage: {
    type: String,
    required: true
  },
  kitaid: Number
});

actionSchema.plugin(autoIncrement.plugin, 'Action');

module.exports = mongoose.model('Action', actionSchema);
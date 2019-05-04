var mongoose = require('mongoose');
autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

autoIncrement.initialize(mongoose.connection);

var kitaSchema = new Schema({
  kitaname:  {
      type: String,
      required : true,
      unique: true
  },
  description: {
      type: String,
      required : true
  },
  ort        : String,
  kanton     : String,
  plz        : Number,
  address    : String,
  telefon    : String,
  email      : String,
  uImageKita : String
});

kitaSchema.plugin(autoIncrement.plugin, 'Kita');

module.exports = mongoose.model('Kita', kitaSchema);
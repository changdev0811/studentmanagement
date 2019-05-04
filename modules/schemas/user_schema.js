var mongoose = require('mongoose');
autoIncrement = require('mongoose-auto-increment');
var passportLocalMongoose = require('passport-local-mongoose');
var Schema = mongoose.Schema;
var jwt = require('jsonwebtoken');

autoIncrement.initialize(mongoose.connection);

var userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  newPwReset: String,
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  address: {
    type: String
  },
  plz: {
    type: Number
  },
  ort: {
    type: String
  },
  birth_date: {
    type: Date,
    required: true
  },
  telefon: String,
  description: String,
  vorlieben: String,
  essenAllerg: String,
  email: String,
  usertype: Number,
  profilPathImg: String,
  kitaid: {
    type: Number,
    required: true,
  },
  groupid: {
    type: Number,
    required: true
  },
  firstLogin: String,
  pwChange: String,
  Montag: String,
  Dienstag: String,
  Mittwoch: String,
  Donnerstag: String,
  Freitag: String,
  Samstag: String,
  Sonntag: String,
});

userSchema.plugin(autoIncrement.plugin, 'User');
userSchema.plugin(passportLocalMongoose);

userSchema.methods.generateJwt = function () {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    userid: this._id,
    username: this.username,
    name: this.name,
    usertype: this.usertype,
    profilPathImg: this.profilPathImg,
    kitaid: this.kitaid,
    kitaname: null,
    groupid: this.groupid,
    groupname: null,
    firstLogin: this.firstLogin,
    pwChange: this.pwChange,
    first_name: this.first_name,
    last_name : this.last_name,
    exp: parseInt(expiry.getTime() / 1000),
  }, "kita"); 
};

module.exports = mongoose.model('User', userSchema);
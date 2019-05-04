var UserSchema = require('../schemas/user_schema.js');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var jwtDecode = require('jwt-decode');

module.exports.login = function (req, res) {

 passport.authenticate('local', function(err, user, info){
  var token;

  // If Passport throws/catches an error
  if (err) {
    res.status(401).json(err);
    return;
  }

  // If a user is found
  if(user){
    token = user.generateJwt();
    var decodedToken = jwtDecode(token);
    res.status(201);
    res.json({
      'token' : token,
      'decodedToken' : decodedToken
    });
  } else {
    // If user is not found
    res.status(401).json(info);
  }
})(req, res);

}
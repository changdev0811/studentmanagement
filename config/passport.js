var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var UserSchema = require('../modules/schemas/user_schema');
var bcrypt = require('bcryptjs');

passport.use(new LocalStrategy({
    usernameField: 'username'
  },
  function(username, password, done) {
    UserSchema.findOne({ username: username.toLowerCase() }, function (err, user) {
      if (err) { return done(err); }
      // Return if user not found in database
      if (!user) {
        return done(null, false, {
          message: 'Benutezr oder Passwort falsch!'
        });
      }
      // Return if password is wrong
      if (user && !bcrypt.compareSync(password, user.password)) {
        return done(null, false, {
          message: 'Passwort ist falsch!'
        });
      }
      // If credentials are correct, return the user object
      return done(null, user);
    });
  }
));
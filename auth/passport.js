var passport = require('passport');
var JWTStrategy = require('passport-jwt').Strategy;
var flash = require('connect-flash');
var config = require('../config.js');
var User = require('../db/models/user');

// create options object to pass in to strategy
var options = {
  // config.SECRET comes from config.json file
  secretOrKey: config.SECRET,
  // pass req to the verify callback
  passReqToCallback: true
};

// login strategy named jwt-login
passport.use('jwt-login', new JWTStrategy(options, function(req, jwt_payload, done) {
  // look in User model for
  User.findOne({id: jwt_payload.sub}, function(err, user) {
    if (err) {
      return done(err, false);
    }
    if (user) {
      done(null, user);
    } else {
      done(null, false);
      // or create a new account
    }
  })
}));

// register strategy named jwt-register
passport.use('jwt-register', new JWTStrategy(options, function(req, jwt_payload, done) {
  // look in User model for
  User.findOne({id: jwt_payload.sub}, function(err, user) {
    if (err) {
      return done(err, false);
    }
    if (user) {
      done(null, user,
        req.flash('error', 'User Already Exists'));
    } else {

      var newUser = new User({
        orgName: req.body.orgName,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
      });

      newUser.save(function(err) {
        if (err) {
          return done(err);
        }
        // Successful registration
        return done(null, newUser);
      });
    }
  })
}));
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

//* Local User Model
const User = require("../models/User");


module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      User.findOne({
        email: email,
      }).then((user) => {
        if (!user) {
          return done(null, false, {
            message: "This email ID is not registered",
          });
        }

        //* Password Mathcing
        bcrypt.compare(passport, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, {
              message: "Password incorrect! Please try again!",
            });
          }
        });
      });
    })
  );
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
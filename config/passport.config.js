const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const UserModel = require("../models/users.model");

// basic config for login using passport local
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    function (email, password, done) {
        UserModel.findOne({ email: email })
        .then((userModel) => {
          // Return error message if userModel not found in database
          if (!userModel) {
            return done(null, false, {
              message: "Incorrect email or password.",
            });
          }

          // Return if password is wrong
          if (userModel && !userModel.validatePassword(password)) {
            return done(null, false, {
              message: "Password is wrong",
            });
          }

          // // If credentials are correct, return the userModel object
          return done(null, userModel);
        })
        .catch((err) => { // only if exception or errors in db related calls
          if (err) {
            return done(err);
          }
        });
    }
  )
);

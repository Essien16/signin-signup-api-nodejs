const bcrypt = require("bcryptjs");
const { ExtractJwt } = require("passport-jwt");
LocalStrategy = require("passport-local").Strategy;
// JwtStrategy = require("passport-jwt").Strategy;
// ExtractJwt = require('passport-jwt').ExtractJwt; 

const User = require("../models/User");
const loginCheck = passport => {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      User.findOne({ email: email })
        .then((user) => {
          if (!user) {
            console.log("wrong email");
            return done({message: 'Wrong email' });
          }
          
          bcrypt.compare(password, user.password, (error, isMatch) => {
            if (error) throw error;
            if (isMatch) {
              return done(null, user);
            } else {
              console.log("Invalid password");
              return done({message: 'Invalid Password'});
            }
          });
        })
        .catch((error) => console.log(error));
    })
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id, (error, user) => {
      done(error, user);
    });
  });
};

// const options = {
//   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//   secretOrKey: PUB_KEY,
//   algorithims: ['RS256']
// };

module.exports = {
  loginCheck,
};
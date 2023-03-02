const bcrypt = require("bcryptjs");
const passport = require("passport");
JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require("passport-jwt");
// LocalStrategy = require("passport-local").Strategy;
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.PRIVATE_KEY,
  algorithim: ['HS256']
};

const loginCheck = passport => {
  passport.use(
    new JwtStrategy(options, (jwt_payload, done) => {
      User.findOne({_id: jwt_payload._id})
          .then((user) => {
            if (user) {
              return done(null, user);
            } else {
              return done(null, false);
            }
          })
          .catch(err => done(err, null));
    })
  )
}

// const loginCheck = passport => {
//   passport.use(
//     new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
//       User.findOne({ email: email })
//         .then((user) => {
//           if (!user) {
//             console.log("wrong email");
//             return done();
//           }
          
//           bcrypt.compare(password, user.password, (error, isMatch) => {
//             if (error) throw error;
//             if (isMatch) {
//               return done(null, user);
//             } else {
//               console.log("Invalid password");
//               return done();
//             }
//           });
//         })
//         .catch((error) => console.log(error));
//     })
//   );
//   passport.serializeUser((user, done) => {
//     done(null, user.id);
//   });
//   passport.deserializeUser((id, done) => {
//     User.findById(id, (error, user) => {
//       done(error, user);
//     });
//   });
// };

// const token = jwt.sign({ _id: user._id }, process.env.PRIVATE_KEY);
// console.log(token)

// var decoded = jwt.verify(token, process.env.PRIVATE_KEY);
// console.log(decoded)


module.exports = {
  loginCheck,
};
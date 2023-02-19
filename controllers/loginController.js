const passport = require("passport");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const signUpView = (req, res) => {
    res.render("signup", {
    } );
}

const signUpUser = (req, res) => {
    const { name, email, password, confirm } = req.body;
    if (!name || !email || !password || !confirm) {
      console.log("Required fields are empty");
    }
    //Confirm Passwords
    if (password !== confirm) {
      console.log("Password doesn't match");
    } else {
      //Validation
      User.findOne({ email: email }).then((user) => {
        if (user) {
          console.log("User with this email exists");
          res.render("signup", {
            name,
            email,
            password,
            confirm,
          });
        } else {
          const newUser = new User({
            name,
            email,
            password,
          });
          bcrypt.genSalt(10, (err, salt) =>
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then(res.redirect("/login"))
                .catch((err) => console.log(err));
            })
          );
        }
      });
    }
  };
  

const loginView = (req, res) => {

    res.render("login", {
    } );
}
const loginUser = (req, res) => {
    const { email, password } = req.body;
    //Required
    if (!email || !password) {
      console.log("Please fill in all the fields");
      res.render("login", {
        email,
        password,
      });
    } else {
      passport.authenticate("local", {
        successRedirect: "/home",
        failureRedirect: "/login",
        failureFlash: true,
      })(req, res);
    }
  };

module.exports =  {
    signUpView,
    loginView,
    signUpUser,
    loginUser
};

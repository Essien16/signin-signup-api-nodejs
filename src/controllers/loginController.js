const passport = require("passport");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const signUpView = (req, res) => {
    res.render("signup", {
    } );
}

const signUpUser = async (req, res) => {
    const { name, email, password, confirm } = await req.body;
    if (!name || !email || !password || !confirm) {
      return res.status(400).send("Required fields are empty");
      console.log("Required fields are empty");
    }
    //Confirm Passwords
    if (password !== confirm) {
      return res.status(400).send("Password does not match");
      console.log("Password does not match")
    } else {
      //Validation
      User.findOne({ email: email }).then((user) => {
        if (user) {
          res.status(409).send("User with this email exists")
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


const loginUser = async (req, res) => {
    const { email, password } = await req.body;
    //Required
    try {
      if (!email || !password) {
        return res.status(400).send("Please fill in all the fields");
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
  } catch (error) {
    console.error(error);
  }
};

module.exports =  {
    signUpView,
    loginView,
    signUpUser,
    loginUser
};

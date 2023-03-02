const passport = require("passport");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const Joi = require('joi')
const jwt = require("jsonwebtoken")

const signUpView = (req, res) => {
    res.render("signup", {
    } );
}

const signUpUser = async (req, res) => {
    const { name, email, password, confirm } = req.body;
    const schema = Joi.object({
      name: Joi.string().min(3).required(),
      email: Joi.string().email().required(),
      password: Joi.string(),
      confirm: Joi.ref('password')
    });
    const { error } = schema.validate(req.body)
    if (error) {
      return res.status(400).send(error.details[0].message);
    //use request validation
    // if (!name || !email || !password || !confirm) {
    //   return res.status(400).send("Required fields are empty");
    //   // console.log("Required fields are empty");
    // }
    // //Confirm Passwords
    // if (password !== confirm) {
    //   return res.status(400).send("Password does not match");
    //   // console.log("Password does not match")
    } else {
      //Validation
      await User.findOne({ email: email }).then((user) => {
        if (user) {
          console.log("User with this email exists");
          res.status(409).send("User with this email exists")
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
    const { email, password } = req.body;
    //Required
    try {
      if (!email || !password) {
        return res.status(400).send("Please fill in all the fields");
        // console.log("Please fill in all the fields");
        res.render("login", {
          email,
          password,
        });
      }
      const user = await User.findOne({email:email})
      // console.log(req.body)
    
      const validatePassword = await bcrypt.compare(req.body.password, user.password)
     
      if (validatePassword) {
        const tokenObject = jwtToken(User);
        res.redirect("/home")
      } else return res.status(400).send("Invalid email or password")
    //   } else {
    //   passport.authenticate("local", {
    //     successRedirect: "/home",
    //     failureRedirect: "/login",
    //     failureFlash: true,
    //   })(req, res);
    // }
  
  } catch (error) {
    console.log(error.message);
  }
};


function jwtToken(user) {
  const _id = user._id;
  const expiresIn = '7d';
  
  const jwt_payload = {
    sub: _id,
    iat: Date.now()
  };

  const jwt_token = jwt.sign(jwt_payload, process.env.PRIVATE_KEY, { expiresIn: expiresIn, algorithm: 'HS256'});
  return {
    token: "Bearer " + jwt_token,
    expiresIn: expiresIn
  }
}

module.exports =  {
    signUpView,
    loginView,
    signUpUser,
    loginUser
};

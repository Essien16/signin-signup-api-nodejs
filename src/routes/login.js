const express = require("express");


const {
  signUpView,
  loginView,
  signUpUser,
  loginUser
} = require("../controllers/loginController");
const { homeView } = require("../controllers/homeController");
const { protectRoute, allowIf } = require("../auth/protect");

const router = express.Router();

router.get("/signup", signUpView);
router.get("/login", loginView);

router.get("/home", allowIf, homeView);

router.post("/signup", signUpUser);
router.post("/login", loginUser);

module.exports = router;

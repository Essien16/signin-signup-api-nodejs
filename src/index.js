const express = require('express');
const session = require('express-session');
const app = express();
// const login = require('./routes/login')
const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config();
const passport = require('passport');
const { loginCheck } = require('./auth/passport');
loginCheck(passport);


const database = process.env.MONGOLAB_URI;
mongoose.connect(database, {useUnifiedTopology: true, useNewUrlParser: true })
.then(() => console.log('Database connected'))
.catch(error => console.log(error));

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: false}));
app.use(session({
    secret:'yoooo',
    saveUninitialized: true,
    resave: true
  }));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', require('./routes/login'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, console.log("Port activated at port " + PORT))


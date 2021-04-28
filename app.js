//-------PACKAGES---------//

require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const nodemailer = require('nodemailer')


//-------MONGOOSE---------//

const User = require('./models/User.model')
require('./configs/db.config.js')


// --------NODEMAILER CONFIG ---------//

let transporter =  nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
})


// --------MIDDLEWARE--------//

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(flash())


//----------SESSION----------//

app.use(session({
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true,
}))


//-----------PASSPORT--------------//
passport.serializeUser((user,callback)=>{
  callback(null, user._id)
})
passport.deserializeUser((id,callback)=>{
  User.findById(id)
  .then((result) => {
    callback(null, result)
  })
  .catch((err) => {
    callback(err)
  });
})


passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, (req, email, password, next )=>{
  User.findOne({email})
  .then((user) => {
    if(!user){ 
      return next(null, false, {message: 'Incorrect Email'});
    }

    if(!bcrypt.compareSync(password, user.password)){
      return next(null, false, {message: 'Incorrect Password'});
    }

    return next(null, user)
  })
  .catch((err) => {
    next(err);
  });
}));


app.use(passport.initialize())
app.use(passport.session())



//-------HBS---------//

app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));


// ------ ROUTES ----- //

app.use('/', require('./routes/auth.routes'))
app.use('/', require('./routes/profile.routes'))
app.use('/', require('./routes/search.routes'))

// ---------SERVER LISTEN -------//
app.listen(process.env.PORT || 3000, ()=>{
    console.log("Server listening")   
})
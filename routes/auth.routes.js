//--------------PACKAGES-----------//

const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')
const validator = require('email-validator')

const User = require('../models/User.model')

//----------ROUTES----------//

// ------- Render the sign up form route ---------//
router.get('/signup', (req, res) => {
    const layout = req.user ? '/layouts/auth' : '/layouts/noAuth'
    res.status(200).render('auth/signup', {layout: layout})
})

// --------- Create the user in the DB route ------//
router.post('/signup', (req, res) =>{
    const {username, password, passwordConfirm, email, age, profilePic} = req.body

    if (email === '' || password === '' || username === '' || age === ''){
        const layout = req.user ? '/layouts/auth' : '/layouts/noAuth'
        res.status(406).render('auth/signup', {errMsg: 'All fields are mandatory.', layout: layout})
        return
    }else if(!validator.validate(email)){
        const layout = req.user ? '/layouts/auth' : '/layouts/noAuth'
        res.status(406).render('auth/signup', {errMsg: 'Please use a valid email.', layout: layout})
        return
    }else if(password !== passwordConfirm){
        const layout = req.user ? '/layouts/auth' : '/layouts/noAuth'
        res.status(406).render('auth/signup', {errMsg: 'Password and confirmation are not equal.', layout: layout})
        return
    }else if(password.length < 8){
        const layout = req.user ? '/layouts/auth' : '/layouts/noAuth'
        res.status(406).render('auth/signup', {errMsg: 'Password needs to be at least 8 chars long.', layout: layout})
        return
    }else{
        User.findOne({email})
        .then((result) => {
            if (result) {
                const layout = req.user ? '/layouts/auth' : '/layouts/noAuth'
                res.status(406).render('auth/signup', {errMsg: 'There is already an account with this email', layout: layout})
            } else {
                const hashedPassword = bcrypt.hashSync(password, 10)
                User.create({
                    username: username, 
                    password: hashedPassword,
                    email: email, 
                    age: age,
                    profilePic: profilePic,
                })
                .then((result) => {
                    res.status(201).redirect('/login')
                })
            }
        })
        .catch((error) => {
            res.status(400).render('error', {error: error})
        })
    }
})

// ---------- Render the login form route ----------//
router.get('/login', (req, res) => {
    const layout = req.user ? '/layouts/auth' : '/layouts/noAuth'
    res.status(200).render('auth/login', {errMsg: req.flash('error'), layout: layout})
})

// -------- Chech the user with passport for login route ----------// 
router.post('/login', passport.authenticate ('local', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true,
    passReqToCallback: true
}))

// ---------- Logout route -----------//
router.get('/logout', (req, res) => {
    req.logout()
    res.status(200).redirect('/')
})

// -----Export routes -----//
module.exports = router
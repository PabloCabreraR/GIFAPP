const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')
const validator = require('email-validator')

const User = require('../models/User.model')


router.get('/signup', (req, res) => {
    const layout = req.user ? '/layouts/auth' : '/layouts/noAuth'
    res.render('auth/signup', {layout: layout})
})

router.post('/signup', (req, res) =>{
    const {username, password, email, age, profilePic} = req.body

    if (email === '' || password === '' || username === '' || age === ''){
        const layout = req.user ? '/layouts/auth' : '/layouts/noAuth'
        res.render('auth/signup', {errMsg: 'All fields are mandatory.', layout: layout})
        return
    }else if(!validator.validate(email)){
        const layout = req.user ? '/layouts/auth' : '/layouts/noAuth'
        res.render('auth/signup', {errMsg: 'Please use a valid email.', layout: layout})
        return
    }else if(password.length < 8){
        const layout = req.user ? '/layouts/auth' : '/layouts/noAuth'
        res.render('auth/signup', {errMsg: 'Password needs to be at least 8 chars long.', layout: layout})
        return
    }else{
        User.findOne({email})
        .then((result) => {
            if (result) {
                const layout = req.user ? '/layouts/auth' : '/layouts/noAuth'
                res.render('auth/signup', {errMsg: 'There is already an account with this email', layout: layout})
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
                    res.redirect('/login')
                })
            }
        })
        .catch((err) => {
            res.send(err)
        })
    }
})

router.get('/login', (req, res) => {
    const layout = req.user ? '/layouts/auth' : '/layouts/noAuth'
    res.render('auth/login', {errMsg: req.flash('error'), layout: layout})
})

router.post('/login', passport.authenticate ('local', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true,
    passReqToCallback: true
}))

router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

module.exports = router
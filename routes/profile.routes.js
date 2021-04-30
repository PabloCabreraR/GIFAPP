//--------------PACKAGES-----------//

const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs')

const User = require('../models/User.model')
const Gif = require('../models/Gif.model');

// ----------MIDDLEWARE---------//

const checkForAuth = (req,res,next) => {
    if(req.isAuthenticated()){
      return next()
    }else{
      res.status(401).redirect('/login')
    }
}


//----------ROUTES----------//

//----Profile route ------//
router.get('/profile', checkForAuth ,(req, res) => {
    const layout = req.user ? '/layouts/auth' : '/layouts/noAuth'
    const anyFavorites = req.user.favGifs.length > 0 ? true : false
    User.findById(req.user._id)
        .populate('favGifs')
        .then(result => {
          res.status(200).render('profile/profile', {user: result, layout: layout, fav: anyFavorites})
        })
        .catch(error => {
          res.status(400).render('error', {error: error})
        })
})

// ------  Add a gif to favorites route ------//
router.post('/add-gif', checkForAuth, (req, res)=>{
  if (req.user){

    Gif.findOne({original_url: req.body.original_url})
      .then(exists => {
        if (!exists){

          Gif.create(req.body)
            .then(created => {
              User.findByIdAndUpdate(req.user._id, {$push: {favGifs: created._id}})
                .then(saved => {
                  res.status(204).send()
                })
            })
        }else{

            User.findById(req.user._id)
                .then(result => {
                  if(result.favGifs.includes(exists._id)){
                    res.status(204).send()
                  }else{
                    User.findByIdAndUpdate(req.user._id, {$push: {favGifs: exists._id}})
                      .then(saved => {
                        res.status(204).send()
                      })
                  }
                })
        }
      })
      .catch(error => {
        res.status(400).render('error', {error: error})
      })

  }else{

    res.status(401).redirect('/login')
  }
})

// ------- Remove a gif from favorites route ------ //
router.post('/remove-gif/:_id', checkForAuth, (req, res) => {
  User.findByIdAndUpdate(req.user._id, {$pull: {favGifs: req.params._id}})
    .then(() => {
      res.status(200).redirect('/profile')
    })
    .catch(error => {
      res.status(400).render('error', {error: error})
    })
})

// -------- Render the edit profile form route ----//
router.get('/edit-user', checkForAuth, (req, res)=>{
  const layout = req.user ? '/layouts/auth' : '/layouts/noAuth'
  res.status(200).render('profile/edit-profile', {layout: layout})
})

// -------- Edit the user in the DB route -------//
router.post('/edit-user', checkForAuth, (req, res)=>{
  const {username, password, age} = req.body
  const layout = req.user ? '/layouts/auth' : '/layouts/noAuth'
  if (password === '' || username === '' || age === ''){

      res.status(406).render('profile/edit-profile', {errMsg: 'All fields are mandatory.', layout: layout})
  }else{
    User.findOne({username: username})
      .then(exists => {
        if(!exists){
          const hashedPassword = bcrypt.hashSync(password)
          User.findByIdAndUpdate(req.user._id, {username: username, password: hashedPassword, age: age})
            .then(result => {
              res.status(202).redirect('/profile')
            })
        }else{
          res.render('profile/edit-profile', {errMsg: 'There is already someone with that username, choose another one.', layout: layout})
        }
      })
      .catch(error => {
        res.status(400).render('error', {error: error})
      })    
  }
})

// --------- Delete user form route ---------------//
router.get('/delete-account', checkForAuth, (req, res)=>{
  const layout = req.user ? '/layouts/auth' : '/layouts/noAuth'
  res.render('profile/delete-profile', {user: req.user, layout: layout})
})

// -------- Delete user from the DB route ----------// 
router.post('/delete-account/', checkForAuth, (req, res)=>{
  if (req.user.username === req.body.username){
    User.findByIdAndDelete(req.user._id)
    .then(() => {
        req.logout()
        res.status(200).redirect('/')
    })
    .catch(error=>{
      res.status(400).render('error', {error: error})
    })
  }else{
    const layout = req.user ? '/layouts/auth' : '/layouts/noAuth'
    res.status(401).redirect('/delete-profile', {user: req.user, layout: layout})
  }
})

// ------- Export routes ---------//
module.exports = router
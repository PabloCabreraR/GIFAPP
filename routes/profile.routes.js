//--------------PACKAGES-----------//

const express = require('express')
const router = express.Router();

const User = require('../models/User.model')
const Gif = require('../models/Gif.model');
const { readSync } = require('node:fs');

// ----------MIDDLEWARE---------//

const checkForAuth = (req,res,next) => {
    if(req.isAuthenticated()){
      return next()
    }else{
      res.redirect('/login')
    }
}


//----------ROUTES----------//

router.get('/profile', checkForAuth ,(req, res) => {
    const layout = req.user ? '/layouts/auth' : '/layouts/noAuth'
    const anyFavorites = req.user.favGifs.length > 0 ? true : false
    User.findById(req.user._id)
        .populate('favGifs')
        .then(result => {
          res.status(200).render('profile/profile', {user: result, layout: layout, fav: anyFavorites})
        })
        .catch(error => {
          console.log(error)
        })
})

router.post('/add-gif', checkForAuth, (req, res)=>{
  if (req.user){

    Gif.findOne({original_url: req.body.original_url})
      .then(exists => {
        if (!exists){

          Gif.create(req.body)
            .then(created => {
              User.findByIdAndUpdate(req.user._id, {$push: {favGifs: created._id}})
                .then(saved => {
                  return
                })
            })
        }else{

            User.findById(req.user._id)
                .then(result => {
                  if(result.favGifs.includes(exists._id)){
                    return 
                  }else{
                    User.findByIdAndUpdate(req.user._id, {$push: {favGifs: exists._id}})
                      .then(saved => {
                        return
                      })
                  }

                })
        }
      })
      .catch(error => {
        console.log(error)
      })

  }else{

    res.redirect('/login')
  }
})

router.post('/remove-gif/:_id', checkForAuth, (req, res) => {
  User.findByIdAndUpdate(req.user._id, {$pull: {favGifs: req.params._id}})
    .then(() => {
      res.status(200).redirect('/profile')
    })
    .catch(error => {
      console.log(error)
    })
})

router.get('/edit-user', checkForAuth, (req, res)=>{
  const layout = req.user ? '/layouts/auth' : '/layouts/noAuth'
  res.status(200).render('profile/edit-profile', {layout: layout})
})

router.post('/edit-user', checkForAuth, (req, res)=>{
  User.findByIdAndUpdate(req.user._id, req.body)
    .then(result => {
      res.status(200).redirect('/profile')
    })
    .catch(error => {
      console.log(error)
    })
    
})

router.get('/delete-account', checkForAuth, (req, res)=>{
  const layout = req.user ? '/layouts/auth' : '/layouts/noAuth'
  res.render('profile/delete-profile', {user: req.user, layout: layout})
})

router.post('/delete-account/', checkForAuth, (req, res)=>{
  if (user.req.username === req.body.username){
    User.findByIdAndDelete(req.user._id)
    .then(() => {
        res.status(200).redirect('/')
    })
    .catch(error=>{
        console.log(error)
    })
  }else{
    const layout = req.user ? '/layouts/auth' : '/layouts/noAuth'
    res.redirect('/delete-profile', {user: req.user, layout: layout})
  }
})

module.exports = router
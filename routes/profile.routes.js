//--------------PACKAGES-----------//

const express = require('express')
const router = express.Router();

const User = require('../models/User.model')
const Gif = require('../models/Gif.model');
const { exists } = require('../models/User.model');

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
          res.render('profile/profile', {user: result, layout: layout, fav: anyFavorites})
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
                  console.log('Gif created and saved in the users array')
                  return
                })
            })
        }else{

            User.findById(req.user._id)
                .then(result => {
                  if(result.favGifs.includes(exists._id)){
                    console.log('You already have this one')
                    return
                  }else{
                    User.findByIdAndUpdate(req.user._id, {$push: {favGifs: exists._id}})
                      .then(saved => {
                        console.log('Gif saved in the users array')
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

  User.findById(req.user._id)
    .then((user) => {
      console.log(user)
      const newFavGifs = user.favGifs.filter((gif)=>{
        return gif._id !== req.params._id
      })
      User.findByIdAndUpdate(user._id, {favGifs: newFavGifs})
        .then((ress)=>{
          res.redirect('/profile')
          console.log(ress)
        })
    }).catch(error => {
      console.log(error)
    })
})

router.post('/delete-account/', checkForAuth, (req, res)=>{
    User.findByIdAndDelete(req.user._id)
    .then(result=>{
        res.redirect('/')
    })
    .catch(error=>{
        console.log(error)
    })
})

module.exports = router
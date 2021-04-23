//--------------PACKAGES-----------//

const express = require('express')
const router = express.Router();

const User = require('../models/User.model')
const Gif = require('../models/Gif.model')

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
    res.render('profile/profile', {user: req.user._doc, layout: layout})
  })

router.post('/fav-gif', (req, res)=>{
  
  return
})

router.post('/delete-account/:id', (req, res)=>{
    User.findByIdAndDelete(req.params._id)
    .then(result=>{
        res.redirect('/')
    })
    .catch(err=>{
        console.log(err)
    })
})

module.exports = router
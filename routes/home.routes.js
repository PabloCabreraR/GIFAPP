const express = require('express')
const router  = express.Router()


//-------- HOME PAGE--------//
router.get('/', (req, res) => {
    const layout = req.user ? '/layouts/auth' : '/layouts/noAuth'
    res.render('home', {layout: layout})
})

module.exports = router
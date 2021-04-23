const express = require('express')
const router  = express.Router()
const axios = require('axios')


//-------- HOME PAGE--------//
router.get('/', (req, res) => {
    const layout = req.user ? '/layouts/auth' : '/layouts/noAuth'
    res.render('home', {layout: layout})
})

router.post('/results', (req, res)=> {
    axios.get(`https://api.giphy.com/v1/gifs/search?api_key=${process.env.API_KEY}&q=${req.body.search}&limit=50&offset=0&rating=g&lang=en`)
        .then(result => {
            const layout = req.user ? '/layouts/auth' : '/layouts/noAuth'
            res.status(200).render('search-results', {gifs: result.data.data, layout: layout})
        })
        .catch(error => {
            console.log(error)
        })
})

module.exports = router
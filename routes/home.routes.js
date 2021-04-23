const express = require('express')
const router  = express.Router()
const axios = require('axios')


//-------- HOME PAGE--------//
router.get('/', (req, res) => {
    res.render('home')
})

router.post('/results', (req, res)=> {
    axios.get(`https://api.giphy.com/v1/gifs/search?api_key=${process.env.API_KEY}&q=${req.body.search}&limit=50&offset=0&rating=g&lang=en`)
        .then(result => {
            res.status(200).render('search-results', {gifs: result.data.data})
        })
        .catch(error => {
            console.log(error)
        })
})

module.exports = router
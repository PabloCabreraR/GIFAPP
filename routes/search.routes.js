const express = require('express')
const router  = express.Router()
const axios = require('axios')
let rating;


// ------------SEARCH RESULTS PAGE---------- //
router.post('/results', (req, res)=> {
    if (req.body.search === '') res.redirect('/')
    if (req.user){
        const {age} = req.user
        if (age >= 13 && age < 18){
            rating = 'pg-13'
        }else if(age >= 18){
            rating = 'r'
        }else{
            rating = 'pg'
        }
        axios.get(`https://api.giphy.com/v1/gifs/search?api_key=${process.env.API_KEY}&q=${req.body.search}&limit=20&offset=0&rating=${rating}&lang=en`)
        .then(result => {
            const layout = '/layouts/auth'
            res.status(200).render('search-results', {gifs: result.data.data, layout: layout})
        })
        .catch(error => {
            console.log(error)
        })
    }else{
        axios.get(`https://api.giphy.com/v1/gifs/search?api_key=${process.env.API_KEY}&q=${req.body.search}&limit=20&offset=0&rating=g&lang=en`)
        .then(result => {
            const layout = '/layouts/noAuth'
            res.status(200).render('search-results', {gifs: result.data.data, layout: layout})
        })
        .catch(error => {
            console.log(error)
        })
    }
})


module.exports = router
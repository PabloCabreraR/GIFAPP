const express = require('express')
const router  = express.Router()
const axios = require('axios')
let rating;
let page = 0

//-------- HOME PAGE--------//
router.get('/', (req, res) => {
    const layout = req.user ? '/layouts/auth' : '/layouts/noAuth'
    res.render('home', {page: page, layout: layout})
})

// ------------SEARCH RESULTS PAGE---------- //
router.post('/results/:page', (req, res)=>{
    page = req.params.page
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
        axios.get(`https://api.giphy.com/v1/gifs/search?api_key=${process.env.API_KEY}&q=${req.body.search}&limit=20&offset=${page}&rating=${rating}&lang=en`)
        .then(result => {
            console.log(page)
            const layout = '/layouts/auth'
            res.status(200).render('search-results', {
                gifs: result.data.data, 
                layout: layout, 
                body: req.body.search, 
                firstPage: page === 0 ? true : false,
                page: page, 
                nextPage: Number(page)+20, 
                prevPage: Number(page)-20,

            })
        })
        .catch(error => {
            console.log(error)
        })
    }else{
        axios.get(`https://api.giphy.com/v1/gifs/search?api_key=${process.env.API_KEY}&q=${req.body.search}&limit=20&offset=${page}&rating=g&lang=en`)
        .then(result => {
            const layout = '/layouts/noAuth'
            res.status(200).render('search-results', {
                gifs: result.data.data, 
                layout: layout, 
                body: req.body.search, 
                firstPage: page == 0,
                page: page, 
                nextPage: Number(page)+20, 
                prevPage: Number(page)-20,
            })
        })
        .catch(error => {
            console.log(error)
        })
    }
})


module.exports = router
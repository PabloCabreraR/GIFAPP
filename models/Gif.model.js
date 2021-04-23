const mongoose = require('mongoose')


const Schema = mongoose.Schema


const gifSchema = new Schema({
    title: String,
    original_url: String,
    fixed_width_url: String,
    rating: String,
}, {
    versionKey: false
})


const Gif = mongoose.model('Gif', gifSchema)


module.exports = Gif 
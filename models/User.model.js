const mongoose = require('mongoose')


const Schema = mongoose.Schema


const userSchema = new Schema({
    username: {type: String, required: true, unique: true},
    age: {type: Number, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, minlength: 8},
    favGifs: [{type: Schema.Types.ObjectId, ref: 'Gif'}],
    validated: {type: Boolean, default: false}
}, {
    versionKey: false
})


const User = mongoose.model('User', userSchema)


module.exports = User 
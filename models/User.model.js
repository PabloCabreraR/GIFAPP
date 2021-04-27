const mongoose = require('mongoose')


const Schema = mongoose.Schema


const userSchema = new Schema({
    username: {type: String, required: true, unique: true},
    age: {type: Number, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, minlength: 8},
    profilePic: {type: String, default: "https://miro.medium.com/max/720/1*W35QUSvGpcLuxPo3SRTH4w.png"},
    favGifs: [{type: Schema.Types.ObjectId, ref: 'Gif'}]
}, {
    versionKey: false
})


const User = mongoose.model('User', userSchema)


module.exports = User 
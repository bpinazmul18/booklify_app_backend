const Joi = require('joi')
const jwt = require('jsonwebtoken')
const config = require('config')
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxLength: 50,
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxLength: 255,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 4,
        maxLength: 1024
    },
    isAdmin: Boolean,
}, { timestamps: true })

userSchema.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id, name: this.name, email: this.email, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'))
}

const User = new mongoose.model('User', userSchema)


function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(4).max(255).required()
    })

    return schema.validate(user)
}
module.exports.userSchema = userSchema
module.exports.validate = validateUser
module.exports.User = User

const Joi = require('joi')
const mongoose = require('mongoose')

const Book = new mongoose.model('Book', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minLength: 2,
        maxLength: 255,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    author: {
        type: String,
        required: true,
        trim: true,
        minLength: 2,
        maxLength: 255,
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
}, { timestamps: true }))

function validateBook(book) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(255).required(),
        price: Joi.number().min(0).required(),
        author: Joi.string().min(2).max(255).required(),
    })

    return schema.validate(book)
}

function updateValidateBook(book) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(255),
        price: Joi.number().min(0),
        author: Joi.string().min(2).max(255),
    })

    return schema.validate(book)
}

module.exports.Book = Book
module.exports.validate = validateBook
module.exports.updateValidate = updateValidateBook
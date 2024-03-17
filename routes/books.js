const express = require('express')
const auth = require('../middleware/auth')
const router = express.Router()
const _ = require('lodash')

const { Book, validate } = require('../models/book')
const { User } = require('../models/user')

router.get('/', [auth], async (req, res) => {
    const books = await Book.find({ uploadedBy: req.user._id })
        .select(['-__v', '-uploadedBy'])
        .sort('name')

    return res.status(200).send({
        status: 200,
        success: true,
        message: 'Book successfully got.',
        data: books
    })
})



router.post('/', [auth], async (req, res) => {
    // Validate input field
    const { error, value } = validate(req.body)
    if (error) return res.status(400).send({
        status: 400,
        success: false,
        message: error['details'][0].message,
    })


    // Find by userId
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).send({
        status: 404,
        success: false,
        message: 'Invalid user.',
    })

    // New book
    const book = new Book({
        name: value['name'],
        price: value['price'],
        author: value['author'],
        uploadedBy: {
            _id: user._id,
        },
    })

    // Save to database and return to client
    await book.save()

    const result = _.pick(book, ['name', 'price', 'author'])

    return res.status(200).send({
        status: 200,
        success: true,
        message: 'Book successfully added.',
        data: result
    })
})

module.exports = router
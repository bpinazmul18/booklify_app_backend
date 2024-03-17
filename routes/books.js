const express = require('express')
const auth = require('../middleware/auth')
const router = express.Router()
const _ = require('lodash')

const { Book, validate, updateValidate } = require('../models/book')
const { User } = require('../models/user')
const validateObjectId = require('../middleware/validateObjectId')

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

router.get('/search', [auth], async (req, res) => {
    const searchText = req.body.text;
    const searchNumber = parseFloat(searchText);

    const books = await Book.find({
        $or: [
            { name: { $regex: searchText, $options: 'i' } },
            { price: isNaN(searchNumber) ? null : searchNumber },
            { author: { $regex: searchText, $options: 'i' } }
        ]
    })
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

    const result = _.pick(book, ['_id', 'name', 'price', 'author'])

    return res.status(200).send({
        status: 200,
        success: true,
        message: 'Book successfully added.',
        data: result
    })
})

router.get('/:id', [auth, validateObjectId], async (req, res) => {
    // Find book by ID
    const book = await Book.findById(req.params.id)
    if (!book) return res.status(404).send({
        status: 404,
        success: false,
        message: 'Book was not found by given ID!',
    })

    const result = _.omit(book.toObject(), ['uploadedBy'])

    // Response to the client
    return res.send({
        status: 200,
        success: true,
        message: 'Book was found by given ID!',
        data: result
    })
})

router.put("/:id", [auth, validateObjectId], async (req, res) => {
    // Get data by ID and validate input field
    const { error, value } = updateValidate(req.body)
    if (error) return res.status(400).send({
        status: 400,
        success: false,
        message: error['details'][0].message,
    })

    // Find book= by ID and update
    const book = await Book.findByIdAndUpdate(req.params.id, value, { new: true })
    if (!book) return res.status(404).send({
        status: 404,
        success: false,
        message: 'Book was not found by given ID!',
    })

    const result = _.omit(book.toObject(), ['uploadedBy'])

    // Response to the client
    return res.send({
        status: 200,
        success: true,
        message: 'Book was updated by given ID!',
        data: result
    })
})

router.delete('/:id', [auth], async (req, res) => {
    // Find user by ID
    const book = await Book.findByIdAndRemove(req.params.id)
    if (!book) return res.status(404).send({
        status: 404,
        success: false,
        message: 'Book was not found by given ID!',
    })

    const result = _.omit(book.toObject(), ['uploadedBy'])

    // Response to the client
    return res.send({
        status: 200,
        success: true,
        message: 'Book was deleted by given ID!',
        data: result
    })
})

module.exports = router
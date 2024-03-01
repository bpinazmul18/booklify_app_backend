const express = require('express')
const auth = require('../routes/auth')
const home = require('../routes/home')
const users = require('../routes/users')
const error = require('../middleware/error')

module.exports = function (app) {
    //middleware
    app.set('view engine', 'pug')
    app.set('views', "./views")
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(express.static('public'))


    //routes
    app.use('/', home)
    app.use('/api/genres', genres)
    app.use('/api/movies', movies)
    app.use('/api/customers', customers)
    app.use('/api/rentals', rentals)
    app.use('/api/users', users)
    app.use('/api/returns', returns)
    app.use('/api/auth', auth)

    //error
    app.use(error)
}


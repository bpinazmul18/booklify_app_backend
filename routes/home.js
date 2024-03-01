const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
    res.render('index', {title: 'My express app.', message: 'Hello world'})
})

module.exports = router

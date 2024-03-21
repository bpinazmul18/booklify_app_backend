const Joi = require('joi')
const bcrypt = require('bcrypt')
const express = require('express')
const router = express.Router()

const { User } = require('../models/user')

router.post('/', async (req, res) => {
    const { error, value } = validate(req.body)
    if (error) return res.status(400).send({
        status: 400,
        success: false,
        message: error['details'][0].message
    })

    let user = await User.findOne({ email: value['email'] })
    if (!user) return res.status(400).send({
        status: 400,
        success: false,
        message: 'Invalid email or password.'
    })

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) return res.status(403).send({
        status: 403,
        success: false,
        message: 'Invalid email or password.'
    })

    const token = user.generateAuthToken()
    return res.status(200).send({
        status: 200,
        success: true,
        message: 'User successfully login.',
        token
    })
})

function validate(req) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    })

    return schema.validate(req)
}

module.exports = router

const bcrypt = require('bcrypt')
const _ = require('lodash')
const express = require('express')
const router = express.Router()

const { User, validate } = require('../models/user')
const auth = require('../middleware/auth')


router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user.id).select('-password')
    return res.send(user)
})


router.post('/', async (req, res) => {
    const { error, value } = validate(req.body)
    if (error) return res.status(400).send(error['details'][0].message)

    let user = await User.findOne({ email: value['email'] })
    if (user) return res.status(403).send({
        status: 403,
        success: false,
        message: 'User already registered.'
    })

    user = await new User(_.pick(value, ['name', 'email', 'password']))
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)

    await user.save()

    const result = _.pick(user, ['_id', 'name', 'email'])

    const token = user.generateAuthToken()
    return res.header('x-auth-token', token).header('access-control-expose-headers', 'x-auth-token').status(200).send({
        status: 200,
        success: true,
        message: 'User successfully registered.',
        data: result
    })
})

module.exports = router

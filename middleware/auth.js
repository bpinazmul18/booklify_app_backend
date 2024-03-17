const config = require('config')
const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
    if (!config.get("requiresAuth")) return next();

    // Get token
    const token = req.header('x-auth-token')
    if (!token) return res.status(401).send({
        status: 401,
        success: false,
        message: 'Access denied. No token provided!',
    })

    // Verify token

    try {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'))
        req.user = decoded
        next()
    } catch (ex) {
        return res.status(400).send({
            status: 400,
            success: false,
            message: 'Invalided token!',
        })
    }
}

module.exports = auth
const config = require('config')
const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
    if (!config.get("requiresAuth")) return next();
    
    // Get token
    const token = req.header('x-auth-token')
    if (!token) return res.status(401).send('Access denied. No token provided!')

    // Verify token

    try {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'))
        req.user = decoded
        next()
    } catch (ex) {
        return res.status(400).send('Invalide token!')
    }
}

module.exports = auth
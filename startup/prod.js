const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')

const prod = (app) => {
    app.use(cors())
    app.use(helmet())
    app.use(compression())
}

module.exports = prod

const winston = require('winston')
// require('winston-mongodb')
require('express-async-errors')
const debug = require('debug')('app:startup')
const morgan = require('morgan')

module.exports = function (app) {
    winston.add(new winston.transports.Console({ 
      colorize: true, prettyPrint: true 
    })),
    winston.add(new winston.transports.File({
        name: 'error-file',
        filename: './logs/exceptions.log',
        level: 'error',
        json: false
    }))
    
    winston.exceptions.handle(new winston.transports.File({
        name: 'handle-exceptions',
        filename: './logs/uncoughtExceptions.log',
        level: 'error',
        json: false
    }))

    process.on('unhandledRejection', (ex) => {
        throw ex
    })
    
    // winston.add(new winston.transports.MongoDB({
    //     db: config.get('dbURI')
    // }))

    if(app.get('env') === 'development') {
        app.use(morgan('tiny'))
        debug('Morgan enable...')
    }
}
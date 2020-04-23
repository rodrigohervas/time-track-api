const winston = require('winston')

/**
 * logger: logging middleware for errors using winston
 */

//logger confirguration
const logger = winston.createLogger({
    level: 'info', 
    format: winston.format.json(),
    transports: [
        new winston.transports.File( { filename: 'info.log'} )
    ]
})

//add logging to the console when not in production env
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({ 
        format: winston.format.simple()
        })
    )
}

module.exports = logger
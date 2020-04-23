const { NODE_ENV } = require('./config')
const logger = require('./logger')

/**
 * Error Handling middleware: logs and handles errors por each request
 * @param {object} error 
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 */
function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = {
            //error: { message: "server error", status: 500 }
            error: { message: error.message, status: error.status }
        }
    }
    else {
        logger.error(error)
        response = {
            error: { message: error.message, status: error.status ? error.status: 500 }
        }
    }

    res.status(response.error.status).json(response);
}

module.exports = errorHandler
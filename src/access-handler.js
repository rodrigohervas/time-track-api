const config = require('./config')
const logger = require('./logger')

/**
 * Access handler middleware: validates that the api key is present and valid for each request
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 */
function accessHandler(req, res, next) {
    const apiKey = req.get('authorization')

    //avoid apiKey on home ('/') or about ('/about') paths
    if(req.path === '/' || req.path === '/about' || req.path === '/favicon.ico') {
        next()
    }//mandatory apiKey for the rest of the paths
    else if (!apiKey || apiKey.split(' ')[1] !== config.API_KEY) {
        logger.error(`Unauthorized request to path: ${req.path}`)
        next({ status: '401', message: 'Unauthorized request' })
    }

    next()
}

module.exports = accessHandler
const db = require("../../knexContext")
const config = require('../../config')
const xss = require('xss')
const logger = require('./../../logger')

//pto table name
const ptosTable = 'ptos'

/**
 * XSS validator
 * @param {object} pto 
 */
const serialize = (pto) => (
    {
        id: pto.id, 
        user_id: pto.user_id, 
        type: pto.type, 
        startdate: pto.startdate.toLocaleDateString(), 
        finishdate: pto.finishdate.toLocaleDateString(), 
        comments: xss(pto.comments)
    }
)

/**
 * Validator function to validate the object pto has valid data
 * @param {object} ptoDays 
 */
const validate = (pto) => {
    for (const [key, value] of Object.entries(pto)) {
        if(!value) {
            throw ( {message: `${key} is mandatory`, status: 400} )
        }
    }
}

/**
 * PtoService
 */
const PtoService = {

    /**
     * All: validates that requests with 'GET', 'PUT', 'PATCH', 'DELETE' have a valid user id
     * @param {object} req 
     * @param {object} res 
     * @param {function} next 
     */
    All(req, res, next){
        try {
            const method = req.method
            const id = req.params.id
            const verbs = ['GET', 'PUT', 'PATCH', 'DELETE']

            if( verbs.includes(method) && isNaN(id) ) {
                throw( {message: 'id is mandatory and must be a valid number', status: 400 } )
            }

            next()
        } 
        catch (error) {
            next ({ 
                message: error.message, 
                status: error.status, 
                loc: 'at ptos.service.All', 
                internalMessage: error.message
            })
        }
    },

    /**
     * getAllByUserId: returns a list of ptos for the user id
     * @param {object} req 
     * @param {object} res 
     * @param {function} next 
     */
    getAllByUserId(req, res, next) {
        try {
            const {id} = req.params

            return db
                    .select('*')
                    .from(ptosTable)
                    .where({
                        user_id: id
                    })
                    .then( ptos => {
                        res.status(200).json(ptos.map(pto => serialize(pto)))
                    })
                    .catch( error => {
                        logger.error(`${error.message} at ptos.service.getAllByUserId`)
                        next({ message: error.message, status: error.status})
                    })
        }
        catch(error) {
            next ({ 
                message: 'error getting ptos', 
                status: error.status, 
                loc: 'at ptos.service.getAllByUserId', 
                internalMessage: error.message
            })
        }
    },

    /**
     * getById: returns a pto for the pto id
     * @param {object} req 
     * @param {object} res 
     * @param {function} next 
     */
    getById(req, res, next) {
        try {
            const {id} = req.params

            return db
                    .select('*')
                    .from(ptosTable)
                    .where({
                        id: id
                    })
                    .then( ptos => {
                        const pto = ptos[0]
                        if(!pto) {
                            throw ( {message: `Pto doesn't exist`, status: 404} )
                        }

                        res.status(200).json(serialize(pto))
                    })
                    .catch( error => {
                        logger.error(`${error.message} at ptos.service.getById`)
                        next({ message: error.message, status: error.status})
                    })
        }
        catch(error) {
            next ({ 
                message: 'error getting ptos', 
                status: error.status, 
                loc: 'at ptos.service.getById', 
                internalMessage: error.message
            })
        }
    },

    /**
     * post: creates a pto in the DB and returns it
     * @param {object} req 
     * @param {object} res 
     * @param {function} next 
     */
    post(req, res, next) {
        try{
            const { user_id, type, startdate, finishdate, comments,  } = req.body

            const pto = {
                user_id: user_id, 
                type: type, 
                startdate: startdate, 
                finishdate: finishdate, 
                comments: comments
            }

            validate(pto)

            return db
                .insert(pto)
                .into(ptosTable)
                .returning('*')
                .then(ptos => {
                    const pto = ptos[0]
                    res.status(201).json(serialize(pto))
                })
                .catch(error => {
                    logger.error(`${error.message} at ptos.service.post`)
                    next( { message: error.message, status: error.status } )
                })
        }
        catch(error) {
            next({
                message: 'error creating pto', 
                status: error.status, 
                loc: 'at ptos.service.post', 
                internalMessage: error.message
            })
        }
    },

    /**
     * updates a pto in the DB for the pto id and returns it
     * @param {object} req 
     * @param {object} res 
     * @param {function} next 
     */
    updateById(req, res, next) {
        try {
            const { id } = req.params
            const { user_id, type, startdate, finishdate, comments,  } = req.body

            const pto = {
                id: id, 
                user_id: user_id, 
                type: type, 
                startdate: startdate, 
                finishdate: finishdate, 
                comments: comments
            }

            if(!id) {
                next({message: 'id is mandatory', status: 400})
            }
            
            validate(pto)

            return db
                .update(pto)
                .from(ptosTable)
                .where({ id: id })
                .returning('*')
                .then( ptos => {
                    const pto = ptos[0]
                    if(!pto) {
                        throw ( {message: `Pto doesn't exist`, status: 404} )
                    }
                    //res.status(204).end()
                    res.status(201).json(serialize(pto))
                })
                .catch (error => {
                    logger.error(`${error.message} at ptos.service.updateById`)
                    next( { message: error.message, status: error.status } )
                })           
        }
        catch(error) {
            next({
                message: 'error updating pto', 
                status: error.status, 
                loc: 'at ptos.service.updateById', 
                internalMessage: error.message
            })
        }
    }, 

    /**
     * deleteById: deletes a pto in the DB for the pto id and returns a confirmation message
     * @param {object} req 
     * @param {object} res 
     * @param {function} next 
     */
    deleteById(req, res, next) {
        try {
            const {id} = req.params
            
            if(!id) {
                next({message: 'id is mandatory', status: 400})
            }

            return db
                    .del()
                    .from(ptosTable)
                    .where({
                        id: id
                    })
                    .then(result => {
                        if(!result) {
                            throw ( {message: `Pto doesn't exist`, status: 404} )
                        }
                        res.status(200).json(`${result} pto/s deleted`)
                    })
                    .catch(error => {
                        logger.error(`${error.message} at ptos.service.deleteById`)
                        next( { message: error.message, status: error.status } )
                    })
        }
        catch(error) {
            next({
                message: 'error deleting pto', 
                status: error.status, 
                loc: 'at ptos.service.deleteById', 
                internalMessage: error.message
            })
        }
    }

}

module.exports = PtoService
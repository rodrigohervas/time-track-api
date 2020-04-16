const db = require("../../knexContext")
const config = require('../../config')
const xss = require('xss')
const logger = require('./../../logger')

const ptoDaysTable = 'ptodays'

const validate = (ptoDays) => {
    for (const [key, value] of Object.entries(ptoDays)) {
        if(!value) {
            throw ( {message: `${key} is mandatory`, status: 400} )
        }
    }
}

const PtoDaysService = {

    All(req, res, next){
        try {
            const method = req.method
            const { user_id } = req.params
            const verbs = ['GET', 'PUT', 'PATCH', 'DELETE']

            if( verbs.includes(method) && isNaN(user_id) ) {
                throw( {message: 'user_id is mandatory and must be a valid number', status: 400 } )
            }

            next()
        } 
        catch (error) {
            next ({ 
                message: error.message, 
                status: error.status, 
                loc: 'at ptoDays.service.All', 
                internalMessage: error.message
            })
        }
    },

    getByUserId(req, res, next) {
        try {
            const {user_id} = req.params

            return db
                    .select('*')
                    .from(ptoDaysTable)
                    .where({
                        user_id: user_id
                    })
                    .then( ptoDaysList => {
                        const ptoDays = ptoDaysList[0]
                        if(!ptoDays) {
                            throw ( {message: `PtoDays doesn't exist`, status: 404} )
                        }

                        res.status(200).json(ptoDays)
                    })
                    .catch( error => {
                        logger.error(`${error.message} at ptoDays.service.getByUserId`)
                        next({ message: error.message, status: error.status})
                    })
        }
        catch(error) {
            next ({ 
                message: 'error getting ptoDays', 
                status: error.status, 
                loc: 'at ptoDays.service.getByUserId', 
                internalMessage: error.message
            })
        }
    },

    post(req, res, next) {
        try{
            const { user_id, totaldays, useddays, availabledays  } = req.body

            const ptoDays = {
                user_id: user_id, 
                totaldays: totaldays, 
                useddays: useddays, 
                availabledays: availabledays
            }

            validate(ptoDays)

            return db
                .insert(ptoDays)
                .into(ptoDaysTable)
                .returning('*')
                .then(ptoDaysList => {
                    const ptoDays = ptoDaysList[0]
                    res.status(201).json(ptoDays)
                })
                .catch(error => {
                    logger.error(`${error.message} at ptoDays.service.post`)
                    next( { message: error.message, status: error.status } )
                })
        }
        catch(error) {
            next({
                message: 'error creating ptoDays', 
                status: error.status, 
                loc: 'at ptoDays.service.post', 
                internalMessage: error.message
            })
        }
    },

    updateByUserId(req, res, next) {
        try {
            const { user_id } = req.params
            const { totaldays, useddays, availabledays  } = req.body

            const ptoDays = {
                user_id: user_id, 
                totaldays: totaldays, 
                useddays: useddays, 
                availabledays: availabledays
            }
            
            validate(ptoDays)

            return db
                .update(ptoDays)
                .from(ptoDaysTable)
                .where({ user_id: user_id })
                .returning('*')
                .then( ptoDaysList => {
                    const ptoDays = ptoDaysList[0]
                    if(!ptoDays) {
                        throw ( {message: `PtoDays doesn't exist`, status: 404} )
                    }
                    //res.status(204).end()
                    res.status(201).json(ptoDays)
                })
                .catch (error => {
                    logger.error(`${error.message} at ptoDays.service.updateByUserId`)
                    next( { message: error.message, status: error.status } )
                })           
        }
        catch(error) {
            next({
                message: 'error updating ptoDays', 
                status: error.status, 
                loc: 'at ptoDays.service.updateByUserId', 
                internalMessage: error.message
            })
        }
    }, 

    deleteByUserId(req, res, next) {
        try {
            const {user_id} = req.params
            
            return db
                    .del()
                    .from(ptoDaysTable)
                    .where({
                        user_id: user_id
                    })
                    .then(result => {
                        if(!result) {
                            throw ( {message: `PtoDays doesn't exist`, status: 404} )
                        }
                        res.status(200).json(`${result} ptoDays deleted`)
                    })
                    .catch(error => {
                        logger.error(`${error.message} at ptoDays.service.deleteByUserId`)
                        next( { message: error.message, status: error.status } )
                    })
        }
        catch(error) {
            next({
                message: 'error deleting ptoDays', 
                status: error.status, 
                loc: 'at ptoDays.service.deleteByUserId', 
                internalMessage: error.message
            })
        }
    }, 

}

module.exports = PtoDaysService
const db = require("../../knexContext")
const config = require('../../config')
const xss = require('xss')
const logger = require('./../../logger')

const timeframesTable = 'timeframes'
const serialize = (timeframe) => (
    {
        id: timeframe.id, 
        date: timeframe.date.toLocaleDateString(), 
        starttime: timeframe.starttime, 
        finishtime: timeframe.finishtime, 
        comments: xss(timeframe.comments), 
        user_id: timeframe.user_id
    }
)

const validate = (timeframe) => {
    for (const [key, value] of Object.entries(timeframe)) {
        if(!value) {
            throw ( {message: `${key} is mandatory`, status: 400} )
        }
    }
}

const TimeframesService = {

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
                loc: 'at timeframes.service.All', 
                internalMessage: error.message
            })
        }
    },

    getAllByUserId(req, res, next) {
        try {
            const {id} = req.params

            return db
                    .select('*')
                    .from(timeframesTable)
                    .where({
                        user_id: id
                    })
                    .then( timeframes => {
                        res.status(200).json(timeframes.map(timeframe => serialize(timeframe)))
                    })
                    .catch( error => {
                        logger.error(`${error.message} at timeframes.service.getAllByUserId`)
                        next({ message: error.message, status: error.status})
                    })
        }
        catch(error) {
            next ({ 
                message: 'error getting timeframes', 
                status: error.status, 
                loc: 'at timeframes.service.getAllByUserId', 
                internalMessage: error.message
            })
        }
    },

    getById(req, res, next) {
        try {
            const {id} = req.params

            return db
                    .select('*')
                    .from(timeframesTable)
                    .where({
                        id: id
                    })
                    .then( timeframes => {
                        const timeframe = timeframes[0]
                        if(!timeframe) {
                            throw ( {message: `Timeframe doesn't exist`, status: 404} )
                        }

                        res.status(200).json(serialize(timeframe))
                    })
                    .catch( error => {
                        logger.error(`${error.message} at timeframes.service.getById`)
                        next({ message: error.message, status: error.status})
                    })
        }
        catch(error) {
            next ({ 
                message: 'error getting timeframes', 
                status: error.status, 
                loc: 'at timeframes.service.getById', 
                internalMessage: error.message
            })
        }
    },

    post(req, res, next) {
        try{
            const { date, starttime, finishtime, comments, user_id } = req.body

            const timeframe = {
                date: date, 
                starttime: starttime, 
                finishtime: finishtime, 
                comments: comments, 
                user_id: user_id
            }

            validate(timeframe)

            return db
                .insert(timeframe)
                .into(timeframesTable)
                .returning('*')
                .then(timeframes => {
                    const timeframe = timeframes[0]
                    res.status(201).json(serialize(timeframe))
                })
                .catch(error => {
                    logger.error(`${error.message} at timeframes.service.post`)
                    next( { message: error.message, status: error.status } )
                })
        }
        catch(error) {
            next({
                message: 'error creating timeframe', 
                status: error.status, 
                loc: 'at timeframes.service.post', 
                internalMessage: error.message
            })
        }
    },

    updateById(req, res, next) {
        try {
            const { id } = req.params
            const { date, starttime, finishtime, comments, user_id } = req.body
            
            const timeframe = {
                date: date, 
                starttime: starttime, 
                finishtime: finishtime, 
                comments: comments, 
                user_id: user_id
            }
            
            if(!id) {
                next({message: 'id is mandatory', status: 400})
            }
            
            validate(timeframe)

            return db
                .update(timeframe)
                .from(timeframesTable)
                .where({ id: id })
                .returning('*')
                .then( timeframes => {
                    const timeframe = timeframes[0]
                    if(!timeframe) {
                        throw ( {message: `Timeframe doesn't exist`, status: 404} )
                    }
                    //res.status(204).end()
                    res.status(201).json(serialize(timeframe))
                })
                .catch (error => {
                    logger.error(`${error.message} at timeframes.service.updateById`)
                    next( { message: error.message, status: error.status } )
                })           
        }
        catch(error) {
            next({
                message: 'error updating timeframe', 
                status: error.status, 
                loc: 'at timeframes.service.updateById', 
                internalMessage: error.message
            })
        }
    }, 

    deleteById(req, res, next) {
        try {
            const {id} = req.params
            
            if(!id) {
                next({message: 'id is mandatory', status: 400})
            }

            return db
                    .del()
                    .from(timeframesTable)
                    .where({
                        id: id
                    })
                    .then(result => {
                        if(!result) {
                            throw ( {message: `Timeframe doesn't exist`, status: 404} )
                        }
                        res.status(200).json(`${result} timeframe/s deleted`)
                    })
                    .catch(error => {
                        logger.error(`${error.message} at timeframes.service.deleteById`)
                        next( { message: error.message, status: error.status } )
                    })
        }
        catch(error) {
            next({
                message: 'error deleting timeframe', 
                status: error.status, 
                loc: 'at timeframes.service.deleteById', 
                internalMessage: error.message
            })
        }
    }

}

module.exports = TimeframesService
const express = require('express')
const TimeframesService = require('./timeframes.service')

/**
 * Timeframes Routing middleware
 */

const timeframesRouter = express.Router()

//regular route
timeframesRouter
        .route('/')
        .post(TimeframesService.post)


//route for timeframes/:id
timeframesRouter
        .route('/:id')
        .all(TimeframesService.All)
        .post(TimeframesService.getAllByUserId)
        .get(TimeframesService.getById)
        .put(TimeframesService.updateById)
        .delete(TimeframesService.deleteById)

module.exports = timeframesRouter
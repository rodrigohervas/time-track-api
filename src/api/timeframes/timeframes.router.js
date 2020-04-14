const express = require('express')
const TimeframesService = require('./timeframes.service')


const timeframesRouter = express.Router()

timeframesRouter
        .route('/')
        .post(TimeframesService.post)


timeframesRouter
        .route('/:id')
        .all(TimeframesService.All)
        .post(TimeframesService.getAllByUserId)
        .get(TimeframesService.getById)
        .put(TimeframesService.updateById)
        .delete(TimeframesService.deleteById)

module.exports = timeframesRouter
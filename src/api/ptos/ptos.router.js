const express = require('express')
const PtosService = require('./ptos.service')

/**
 * ptos Routing middleware
 */

const ptosRouter = express.Router()

//regular route
ptosRouter
        .route('/')
        .post(PtosService.post)

//route for ptodays/id
ptosRouter
        .route('/:id')
        .all(PtosService.All)
        .post(PtosService.getAllByUserId)
        .get(PtosService.getById)
        .put(PtosService.updateById)
        .delete(PtosService.deleteById)

module.exports = ptosRouter
const express = require('express')
const PtosService = require('./ptos.service')


const ptosRouter = express.Router()

ptosRouter
        .route('/')
        .post(PtosService.post)


ptosRouter
        .route('/:id')
        .all(PtosService.All)
        .post(PtosService.getAllByUserId)
        .get(PtosService.getById)
        .put(PtosService.updateById)
        .delete(PtosService.deleteById)

module.exports = ptosRouter
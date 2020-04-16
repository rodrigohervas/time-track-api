const express = require('express')
const PtoDaysService = require('./ptoDays.service')


const ptoDaysRouter = express.Router()

ptoDaysRouter
        .route('/')
        .post(PtoDaysService.post)


ptoDaysRouter
        .route('/:user_id')
        .all(PtoDaysService.All)
        .get(PtoDaysService.getByUserId)
        .put(PtoDaysService.updateByUserId)
        .delete(PtoDaysService.deleteByUserId)

module.exports = ptoDaysRouter
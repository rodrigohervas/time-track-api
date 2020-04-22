const express = require('express')
const PtoDaysService = require('./ptoDays.service')

/**
 * ptoDays Routing middleware
 */

const ptoDaysRouter = express.Router()


//regular route
ptoDaysRouter
        .route('/')
        .post(PtoDaysService.post)

//route for ptodays/user_id
ptoDaysRouter
        .route('/:user_id')
        .all(PtoDaysService.All)
        .get(PtoDaysService.getByUserId)
        .put(PtoDaysService.updateByUserId)
        .delete(PtoDaysService.deleteByUserId)

module.exports = ptoDaysRouter
const express = require('express')
const UsersService = require('./users.service')

const usersRouter = express.Router()

usersRouter
    .route('/')
    .get(UsersService.getByUsername)
    .post(UsersService.post)
    .put(UsersService.updateByUsername)
    .patch(UsersService.updateByUsername)
    .delete(UsersService.deleteByUsername)
    
usersRouter
    .route('/all')
    .get(UsersService.getAll)

usersRouter
    .route('/:id')
    .all(UsersService.All)

module.exports = usersRouter
const express = require('express')
const UsersService = require('./users.service')

/**
 * Users Routing middleware
 */

const usersRouter = express.Router()

//route for /users
usersRouter
    .route('/')
    .get(UsersService.getByUsername)
    .post(UsersService.postAsync) //post new user
    .put(UsersService.updateByUsername) //update user for a username
    .patch(UsersService.updateByUsername) //patch user for a username
    .delete(UsersService.deleteByUsername) //delete user for a username

//route for users/login
usersRouter
    .route('/login')
    .post(UsersService.getByUsername) //get user for a username

//route for users/all
// usersRouter
//     .route('/all')
//     .get(UsersService.getAll) //get all users

//router for users/:id
usersRouter
    .route('/:id')
    .all(UsersService.All)

module.exports = usersRouter
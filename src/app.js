require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const accessHandler = require('./access-handler')
const { NODE_ENV } = require('./config')
const logger = require('./logger')
const errorHandler = require('./error-handler')
const usersRouter = require('./api/users/users.router')

const app = express()
const morganOption = (NODE_ENV === 'production') ? 'tiny' : 'common'

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())
app.use(bodyParser.json())

//SECURITY HANDLE MIDDLEWARE
app.use(accessHandler)


//Home endpoint
app.route('/')
    .get((req, res) => {
        res.status(200).json('Welcome to Time Track API')
    })

//Users endpoint
app.use('/api/users', usersRouter)


app.use(errorHandler)


module.exports = app
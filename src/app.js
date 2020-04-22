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
const timeframesRouter = require('./api/timeframes/timeframes.router')
const ptosRouter = require('./api/ptos/ptos.router')
const ptoDaysRouter = require('./api/ptoDays/ptoDays.router')

const app = express()
//configure morgan option
const morganOption = (NODE_ENV === 'production') ? 'tiny' : 'common'

//add logging middleware
app.use(morgan(morganOption))

//set helmet for easy error viewing
app.use(helmet())

//add CORS middleware
app.use(cors())

//add JSON body parsing middleware
app.use(bodyParser.json())

//SECURITY HANDLE MIDDLEWARE
app.use(accessHandler)


//Home endpoint
app.route('/')
    .get((req, res) => {
        res.status(200).json('Welcome to Time Track API')
    })

//favicon.ico endpoint
app.route('/favicon.ico')
    .get((req, res) => {
        res.status(204)
    })

//Users endpoint
app.use('/api/users', usersRouter)

//Timeframes endpoint
app.use('/api/timeframes', timeframesRouter)

//PTOs endpoint
app.use('/api/ptos', ptosRouter)

//PtoDays endpoint
app.use('/api/ptodays', ptoDaysRouter)


//error handling middleware
app.use(errorHandler)


module.exports = app
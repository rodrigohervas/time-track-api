require('dotenv').config()
const { expect } = require('chai')
const supertest = require('supertest')

//set the environment to test so tests get the proper testing db url (check ../src/knexContext.js)
process.env.NODE_ENV = 'test'
//configure UTC to ensure dates don't fail validation --> TZ sshouldn't work in Windows OS!!
process.env.TZ = 'UTC'

global.expect = expect
global.supertest = supertest
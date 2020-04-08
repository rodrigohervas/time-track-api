const { expect } = require('chai')
const supertest = require('supertest')

// adding expect and supertest as global variables
// to avoid needing to require expect and supertest in every new test file
//this file (setup.js) is defined in package.json, in the test script

global.expect = expect
global.supertest = supertest
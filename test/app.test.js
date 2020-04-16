//const { expect } = require('chai')
//const supertest = require('supertest') these are global variables as defined in test/setup.js
const app = require('../src/app')

describe('app', () => {
    it('GET/ responds with 200 and "Welcome to Time Track API"', () => {
        return supertest(app)
                .get('/')
                .expect(200, '"Welcome to Time Track API"')
    })
})
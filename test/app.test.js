//const { expect } = require('chai')
//const supertest = require('supertest') these are global variables as defined in test/setup.js
const app = require('../src/app')

describe('app', () => {
    it('GET/ responds with 200 containing Template Project', () => {
        return supertest(app)
                .get('/')
                .expect(200, '"Template Project"')
                // .expect( 'Content-Type', /json/ )
                // .then( res => {
                //     expect(res.body).to.be.an('array');
                //     const book = res.body[0];
                //     expect(book).to.include.all.keys(
                //         'author', 'description', 'price', 'publisher', 'title', 'id'
                //     );
                // })
    })
})
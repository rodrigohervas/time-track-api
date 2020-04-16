const app = require('../src/app')
const db = require('../src/knexContext')
const { generateCompaniesTestData } = require('./companies.tests.data')
const { generateRolesTestData } = require('./roles.tests.data')
const { generateUsersTestData } = require('./users.tests.data')
const { generatePtoDaysTestData } = require('./ptodays.tests.data')

const testCompanies = generateCompaniesTestData()
const testRoles = generateRolesTestData()
const testUsers = generateUsersTestData()
const testPtoDays = generatePtoDaysTestData()

const companiesTable = 'companies'
const rolesTable = 'roles'
const usersTable = 'users'
const ptoDaysTable = 'ptodays'


beforeEach('empty all tables', () => db.raw('TRUNCATE roles, companies, users, ptodays RESTART IDENTITY CASCADE') )

afterEach('empty all tables', () => db.raw('TRUNCATE roles, companies, users, ptodays RESTART IDENTITY CASCADE') )

after('disconnect from the test db', () => {
    db.destroy()
})

const insertTestData = () => { 
    return beforeEach('insert all test data', async () => {
        await db
            .insert(testRoles)
            .into(rolesTable)
        await db
            .insert(testCompanies)
            .into(companiesTable)
        await db
            .insert(testUsers)
            .into(usersTable)
        return db
            .insert(testPtoDays)
            .into(ptoDaysTable)
    })
}


describe('GET /api/ptodays/:user_id', () => {
    
    insertTestData()

    it('GET /api/ptodays/:user_id => getByUserId: responds with specified ptoDays', () => {
        const ptoDays = { 
            id: 1, 
            user_id: 1, 
            totaldays: 28, 
            useddays: 10, 
            availabledays: 18 
        }

        return supertest(app)
                .get(`/api/ptodays/${ptoDays.user_id}`)
                .set('Authorization', `Bearer ${process.env.API_KEY}`)
                .expect(200)
                .expect( res => {
                    const ptoDaysResult = res.body
                    //console.log('PtoDays: ', ptoDays)
                    expect(ptoDays.id).to.eql(ptoDaysResult.id)
                    expect(ptoDays.user_id).to.eql(ptoDaysResult.user_id)
                    expect(ptoDays.totaldays).to.eql(ptoDaysResult.totaldays)
                    expect(ptoDays.useddays).to.eql(ptoDaysResult.useddays)
                    expect(ptoDays.availabledays).to.eql(ptoDaysResult.availabledays)
                })
    })

    it('GET /api/ptodays/:user_id => getByUserId: responds with 404 "PtoDays doesn\'t exist" when user_id is incorrect', () => {
        const user_id = 888        
        return supertest(app)
                .get(`/api/ptodays/${user_id}`)
                .set('Authorization', `Bearer ${process.env.API_KEY}`)
                .expect( res => {
                    const error = res.body.error
                    expect(error.status).to.eql(404)
                    expect(error.message).to.eql('PtoDays doesn\'t exist')
                })
    })
})

describe('POST /api/ptodays', () => {
    
    beforeEach('insert all test data', async () => {
        await db
            .insert(testRoles)
            .into(rolesTable)
        await db
            .insert(testCompanies)
            .into(companiesTable)
        return db
            .insert(testUsers)
            .into(usersTable)
    })

    it('POST /api/ptodays => creates a ptoDays, responding with 201 and the new ptoDays', () => {
        const ptoDays = { 
            user_id: 1, 
            totaldays: 28, 
            useddays: 10, 
            availabledays: 18 
        }
        
        return supertest(app)
                .post('/api/ptodays')
                .set('Authorization', `Bearer ${process.env.API_KEY}`)
                .send(ptoDays)
                .expect(201)
                .expect( res => {
                    const ptoDaysResult = res.body
                    //console.log('PtoDays: ', ptoDays)
                    expect(ptoDays.user_id).to.eql(ptoDaysResult.user_id)
                    expect(ptoDays.totaldays).to.eql(ptoDaysResult.totaldays)
                    expect(ptoDays.useddays).to.eql(ptoDaysResult.useddays)
                    expect(ptoDays.availabledays).to.eql(ptoDaysResult.availabledays)
                })
    })
})

describe('PUT /api/ptodays/:user_id', () => {
    
    insertTestData()

    it('PUT /api/ptodays/:user_id => updates a ptoDays, responding with 201 and the updated ptoDays', () => {
        const ptoDays = { 
            id: 1, 
            user_id: 1, 
            totaldays: 28, 
            useddays: 10, 
            availabledays: 18 
        }
        
        return supertest(app)
                .put(`/api/ptodays/${ptoDays.user_id}`)
                .set('Authorization', `Bearer ${process.env.API_KEY}`)
                .send(ptoDays)
                .expect(201)
                .expect( res => {
                    const ptoDaysResult = res.body
                    //console.log('PtoDays: ', ptoDays)
                    expect(ptoDays.user_id).to.eql(ptoDaysResult.user_id)
                    expect(ptoDays.totaldays).to.eql(ptoDaysResult.totaldays)
                    expect(ptoDays.useddays).to.eql(ptoDaysResult.useddays)
                    expect(ptoDays.availabledays).to.eql(ptoDaysResult.availabledays)
                })
    })
})

describe('DELETE /api/ptodays/:user_id', () => {
        
    insertTestData()

    it('DELETE /api/ptodays/:user_id deletes a ptoDays, responding with 200 and "1 ptoDays deleted"', () => {
        const user_id = 1
        return supertest(app)
                .delete(`/api/ptodays/${user_id}`)
                .set('Authorization', `Bearer ${process.env.API_KEY}`)
                .expect(200)
                .expect( res => {
                    const msg = res.body
                    expect(msg).to.eql('1 ptoDays deleted')
                })
    })
})
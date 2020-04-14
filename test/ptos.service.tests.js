const app = require('../src/app')
const db = require('../src/knexContext')
const { generateCompaniesTestData } = require('./companies.tests.data')
const { generateRolesTestData } = require('./roles.tests.data')
const { generateUsersTestData } = require('./users.tests.data')
const { generatePtoTypesTestData } = require('./ptotypes.tests.data')
const { generatePtosTestData } = require('./ptos.tests.data')

const testCompanies = generateCompaniesTestData()
const testRoles = generateRolesTestData()
const testUsers = generateUsersTestData()
const testPtoTypes = generatePtoTypesTestData()
const testPtos = generatePtosTestData()

const companiesTable = 'companies'
const rolesTable = 'roles'
const usersTable = 'users'
const ptoTypesTable = 'ptotypes'
const ptosTable = 'ptos'


beforeEach('empty all tables', () => db.raw('TRUNCATE roles, companies, users, ptotypes, ptos RESTART IDENTITY CASCADE') )

afterEach('empty all tables', () => db.raw('TRUNCATE roles, companies, users, ptotypes, ptos RESTART IDENTITY CASCADE') )

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
        await db
            .insert(testPtoTypes)
            .into(ptoTypesTable)
        return db
            .insert(testPtos)
            .into(ptosTable)
    })
}

const formatDate = (date) => {
    return new Date(date + ' 09:00:00').toLocaleDateString('en-US')
}

const formatPto = (pto) => (
    {
        id: pto.id, 
        user_id: pto.user_id, 
        type: pto.type, 
        startdate: formatDate(pto.startdate), 
        finishdate: formatDate(pto.finishdate), 
        comments: pto.comments
    }
)

describe('GET /api/posts', () => {
    
    insertTestData()

    it('GET /api/ptos/:id => getById: responds with specified pto', () => {
        const ptoRequest = {
            id: 5,
            user_id: 1,
            type: 2,
            startdate: "3/1/2020",
            finishdate: "3/4/2020",
            comments: "Request Personal Days from March-1 to March-4"
        }

        return supertest(app)
                .get(`/api/ptos/${ptoRequest.id}`)
                .set('Authorization', `Bearer ${process.env.API_KEY}`)
                .expect(200)
                .expect( res => {
                    const pto = res.body
                    //console.log('PTO: ', pto)
                    expect(ptoRequest.id).to.eql(pto.id)
                    expect(ptoRequest.user_id).to.eql(pto.user_id)
                    expect(ptoRequest.type).to.eql(pto.type)
                    expect(formatDate(ptoRequest.startdate)).to.eql(formatDate(pto.startdate))
                    expect(formatDate(ptoRequest.finishdate)).to.eql(formatDate(pto.finishdate))
                    expect(ptoRequest.comments).to.eql(pto.comments)
                })
    })

    it('GET /api/ptos/:id => getById: responds with 404 "Not Found" when id is incorrect', () => {
        const id = 888        
        return supertest(app)
                .get(`/api/ptos/${id}`)
                .set('Authorization', `Bearer ${process.env.API_KEY}`)
                .expect( res => {
                    const error = res.body.error
                    expect(error.status).to.eql(404)
                    expect(error.message).to.eql('Pto doesn\'t exist')
                })
    })
})

describe('POST /api/ptos/:id', () => {
        
    insertTestData()

    it('POST /api/posts/:id => getAllByUserId: returns all ptos for a specified user id', () => {
        const userId = 1
        const ptosByUserId = testPtos.filter(pto => pto.user_id === userId)
        const formattedPtoRequests = ptosByUserId.map( pto => formatPto(pto) )

        return supertest(app)
                .post(`/api/ptos/${userId}`)
                .set('Authorization', `Bearer ${process.env.API_KEY}`)
                .expect(200)
                .expect(res => {
                    const ptos = res.body
                    const formattedPtos = ptos.map( pto => formatPto(pto) )
                    expect(formattedPtoRequests).to.eql(formattedPtos)
                })
    })
})

describe('POST /api/ptos', () => {
    
    beforeEach('insert all test data', async () => {
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
            .insert(testPtoTypes)
            .into(ptoTypesTable)
    })

    it('POST /api/ptos => creates a pto, responding with 201 and the new pto', () => {
        const ptoRequest = {
            user_id: 1,
            type: 2,
            startdate: "3/1/2020",
            finishdate: "3/4/2020",
            comments: "Request Personal Days from March-1 to March-4"
        }
        
        return supertest(app)
                .post('/api/ptos')
                .set('Authorization', `Bearer ${process.env.API_KEY}`)
                .send(ptoRequest)
                .expect(201)
                .expect( res => {
                    const pto = res.body
                    //console.log('PTO: ', pto)
                    expect(ptoRequest.user_id).to.eql(pto.user_id)
                    expect(ptoRequest.type).to.eql(pto.type)
                    expect(formatDate(ptoRequest.startdate)).to.eql(formatDate(pto.startdate))
                    expect(formatDate(ptoRequest.finishdate)).to.eql(formatDate(pto.finishdate))
                    expect(ptoRequest.comments).to.eql(pto.comments)
                })
    })
})

describe('PUT /api/ptos/:id', () => {
    
    insertTestData()

    it('PUT /api/ptos/:id => updates a pto, responding with 201 and the updated pto', () => {
        const ptoRequest = {
            id: 5,
            user_id: 1,
            type: 2,
            startdate: "3/1/2020",
            finishdate: "3/4/2020",
            comments: "Request Personal Days from March-1 to March-4"
        }
        
        return supertest(app)
                .put(`/api/ptos/${ptoRequest.id}`)
                .set('Authorization', `Bearer ${process.env.API_KEY}`)
                .send(ptoRequest)
                .expect(201)
                .expect( res => {
                    const pto = res.body
                    //console.log('PTO: ', pto)
                    expect(ptoRequest.user_id).to.eql(pto.user_id)
                    expect(ptoRequest.type).to.eql(pto.type)
                    expect(formatDate(ptoRequest.startdate)).to.eql(formatDate(pto.startdate))
                    expect(formatDate(ptoRequest.finishdate)).to.eql(formatDate(pto.finishdate))
                    expect(ptoRequest.comments).to.eql(pto.comments)
                })
    })
})

describe('DELETE /api/ptos/:id', () => {
        
    insertTestData()

    it('DELETE /api/ptos/:id deletes a pto, responding with 200 and "1 pto/s deleted"', () => {
        const id = 3
        return supertest(app)
                .delete(`/api/ptos/${id}`)
                .set('Authorization', `Bearer ${process.env.API_KEY}`)
                .expect(200)
                .expect( res => {
                    const msg = res.body
                    expect(msg).to.eql('1 pto/s deleted')
                })
    })
})
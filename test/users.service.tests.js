// const config = require('../src/config')
// const knex = require('knex')
const app = require('../src/app')
const db = require('../src/knexContext')
const bcrypt = require('bcrypt')
const { generateCompaniesTestData } = require('./companies.tests.data')
const { generateRolesTestData } = require('./roles.tests.data')
const { generateUsersTestData } = require('./users.tests.data')

const testCompanies = generateCompaniesTestData()
const testRoles = generateRolesTestData()
const testUsers = generateUsersTestData()
const companiesTable = 'companies'
const rolesTable = 'roles'
const usersTable = 'users'
const validatePassword = (password, hashedPassword) => { 
    return bcrypt.compareSync(password, hashedPassword)
}

beforeEach('empty the tables', () => db.raw('TRUNCATE companies, roles, users RESTART IDENTITY CASCADE') )

afterEach('truncate tables', () => {
    db.raw('TRUNCATE companies RESTART IDENTITY CASCADE')
    db.raw('TRUNCATE roles RESTART IDENTITY CASCADE')
    db.raw('TRUNCATE users RESTART IDENTITY CASCADE')
})

after('disconnect from the test db', () => {
    db.destroy()
})

describe('GET /api/users', () => {
    
    context(`users has data`, () => {
        
        beforeEach('insert test users', () => {
            return db
                .insert(testRoles)
                .into(rolesTable)
                .then( () => {
                    return db
                        .insert(testCompanies)
                        .into(companiesTable)
                        .then( () => {
                            return db
                                .insert(testUsers)
                                .into(usersTable)
                        })
                })
        })
        
        it('GET /users/all responds with 200 and all of the users', () => {
            return supertest(app)
                    .get('/api/users/all')
                    .set('Authorization', `Bearer ${process.env.API_KEY}`)
                    .expect(200, testUsers)
        })

        it('GET /users responds with specified user', () => {
            const user = {
                id: 3, 
                username: 'paul@jones.com', 
                password: 'paul', 
                role_id: 2, 
                company_id: 1
            }
            return supertest(app)
                    .get('/api/users')
                    .set('Authorization', `Bearer ${process.env.API_KEY}`)
                    //.send(user)
                    .send({
                        username: user.username, 
                        password: user.password
                    })
                    .expect(200)
                    .expect( res => {
                        const usr = res.body
                        expect(usr.id).to.eql(user.id)
                        expect(usr.username).to.eql(user.username)
                        expect(usr.role_id).to.eql(user.role_id)
                        expect(usr.company_id).to.eql(user.company_id)
                        expect(true).to.eql(validatePassword(user.password, usr.password))
                    })
        })

        it('GET /users responds with 404 "Not Found" when username or password are incorrect', () => {
            const user = {
                id: 3, 
                username: 'wrong@email.com',
                password: 'wrongpassword', 
                role_id: 2, 
                company_id: 1
            }
            return supertest(app)
                    .get('/api/users')
                    .set('Authorization', `Bearer ${process.env.API_KEY}`)
                    .send({
                        username: user.username, 
                        password: user.password
                    })
                    .expect( res => {
                        const error = res.body.error
                        expect(error.status).to.eql(404)
                        expect(error.message).to.eql('User doesn\'t exist')
                    })
        })

    })
    

    // context(`users has NO data`, () => {  })
})

describe('POST /api/users', () => {
    
    context(`users has data`, () => {
        
        beforeEach('insert test users', () => {
            return db
                .insert(testRoles)
                .into(rolesTable)
                .then( () => {
                    return db
                        .insert(testCompanies)
                        .into(companiesTable)
                })
        })

        it('creates a user, responding with 201 and the new user', () => {
            const user = {
                id: 1, 
                username: 'james@jones.com', 
                password: 'james', 
                role_id: 1, 
                company_id: 1
            }
            return supertest(app)
                    .post('/api/users')
                    .set('Authorization', `Bearer ${process.env.API_KEY}`)
                    .send(user)
                    .expect(201)
                    .expect( res => {
                        const usr = res.body
                        expect(usr.id).to.eql(user.id)
                        expect(usr.username).to.eql(user.username)
                        expect(usr.role_id).to.eql(user.role_id)
                        expect(usr.company_id).to.eql(user.company_id)
                        expect(true).to.eql(validatePassword(user.password, usr.password))
                    })
        })


    })
})

describe('PUT /api/users', () => {
    
    context(`users has data`, () => {
        
        beforeEach('insert test users', () => {
            return db
                .insert(testRoles)
                .into(rolesTable)
                .then( () => {
                    return db
                        .insert(testCompanies)
                        .into(companiesTable)
                        .then( () => {
                            return db
                                .insert(testUsers)
                                .into(usersTable)
                        })
                })
        })

        it('updates a user, responding with 201 and the updated user', () => {
            const user = {
                id: 1, 
                username: 'michael@jones.com', 
                password: 'michael', 
                role_id: 2, 
                company_id: 2
            }
            return supertest(app)
                    .put('/api/users')
                    .set('Authorization', `Bearer ${process.env.API_KEY}`)
                    .send(user)
                    .expect(201)
                    .expect( res => {
                        const usr = res.body
                        console.log('USR: ', usr)
                        expect(usr.id).to.eql(user.id)
                        expect(usr.username).to.eql(user.username)
                        expect(usr.role_id).to.eql(user.role_id)
                        expect(usr.company_id).to.eql(user.company_id)
                        expect(true).to.eql(validatePassword(user.password, usr.password))
                    })
        })


    })
})

describe('PATCH /api/users', () => {
    
    context(`users has data`, () => {
        
        beforeEach('insert test users', () => {
            return db
                .insert(testRoles)
                .into(rolesTable)
                .then( () => {
                    return db
                        .insert(testCompanies)
                        .into(companiesTable)
                        .then( () => {
                            return db
                                .insert(testUsers)
                                .into(usersTable)
                        })
                })
        })

        it('updates a user, responding with 201 and the updated user', () => {
            const user = {
                id: 1, 
                username: 'michael@jones.com', 
                password: 'michael', 
                role_id: 2, 
                company_id: 2
            }
            return supertest(app)
                    .patch('/api/users')
                    .set('Authorization', `Bearer ${process.env.API_KEY}`)
                    .send(user)
                    .expect(201)
                    .expect( res => {
                        const usr = res.body
                        expect(usr.id).to.eql(user.id)
                        expect(usr.username).to.eql(user.username)
                        expect(usr.role_id).to.eql(user.role_id)
                        expect(usr.company_id).to.eql(user.company_id)
                        expect(true).to.eql(validatePassword(user.password, usr.password))
                    })
        })


    })
})

describe('DELETE /api/users', () => {
    
    context(`users has data`, () => {
        
        beforeEach('insert test users', () => {
            return db
                .insert(testRoles)
                .into(rolesTable)
                .then( () => {
                    return db
                        .insert(testCompanies)
                        .into(companiesTable)
                        .then( () => {
                            return db
                                .insert(testUsers)
                                .into(usersTable)
                        })
                })
        })

        it('deletes a user, responding with 200 and "1 user/s deleted"', () => {
            const user = {
                username: 'michael@jones.com', 
                password: 'michael'
            }
            return supertest(app)
                    .delete('/api/users')
                    .set('Authorization', `Bearer ${process.env.API_KEY}`)
                    .send(user)
                    .expect(200)
                    .expect( res => {
                        const msg = res.body
                        expect(msg).to.eql('1 user/s deleted')
                    })
        })


    })
})